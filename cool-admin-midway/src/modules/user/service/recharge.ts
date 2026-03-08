import { Provide, Inject } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository, QueryRunner } from 'typeorm';
import { UserRechargeEntity } from '../entity/recharge';
import { UserInfoEntity } from '../entity/info';
import { UserTransactionService } from './transaction';

/**
 * 用户充值
 */
@Provide()
export class UserRechargeService extends BaseService {
  @InjectEntityModel(UserRechargeEntity)
  rechargeEntity: Repository<UserRechargeEntity>;

  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @Inject()
  userTransactionService: UserTransactionService;

  @Inject()
  ctx;

  /**
   * 生成充值订单号
   */
  private generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `R${timestamp}${random}`;
  }

  /**
   * 申请充值
   * @param userId 用户ID
   * @param amount 充值金额
   */
  async apply(userId: number, amount: number) {
    if (amount <= 0) {
      throw new CoolCommException('充值金额必须大于0');
    }

    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }

    // 生成订单号
    const orderNo = this.generateOrderNo();

    // 创建充值记录
    const recharge = await this.rechargeEntity.save({
      userId,
      amount,
      orderNo,
      status: 0, // 待充值
    });

    return {
      id: recharge.id,
      orderNo: recharge.orderNo,
      amount: recharge.amount,
      status: recharge.status,
    };
  }

  /**
   * 确认充值成功（后台客服操作）
   * @param id 充值记录ID
   * @param remark 备注
   */
  @CoolTransaction({ connectionName: 'default' })
  async complete(id: number, remark?: string, queryRunner?: QueryRunner) {
    const recharge = await this.rechargeEntity.findOneBy({ id });
    if (!recharge) {
      throw new CoolCommException('充值记录不存在');
    }
    if (recharge.status !== 0) {
      throw new CoolCommException('该充值记录状态已更新');
    }

    const user = await this.userInfoEntity.findOneBy({
      id: Equal(recharge.userId),
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }

    const balanceBefore = Number(user.balance);
    const newBalance = Number(
      (balanceBefore + Number(recharge.amount)).toFixed(2)
    );

    // 增加用户余额
    await this.userInfoEntity.increment(
      { id: recharge.userId },
      'balance',
      Number(recharge.amount)
    );

    // 更新充值记录状态
    await this.rechargeEntity.update({ id }, { status: 1, remark });

    // 写入交易记录
    await this.userTransactionService.createTransaction(
      {
        userId: recharge.userId,
        type: 0, // 充值
        amount: Number(recharge.amount),
        balanceBefore,
        balanceAfter: newBalance,
        remark: remark || '充值成功',
        status: 1,
      },
      queryRunner
    );

    return { id, status: 1 };
  }

  /**
   * 标记为超时
   * @param id 充值记录ID
   */
  async timeout(id: number) {
    const recharge = await this.rechargeEntity.findOneBy({ id });
    if (!recharge) {
      throw new CoolCommException('充值记录不存在');
    }
    if (recharge.status !== 0) {
      throw new CoolCommException('该充值记录状态已更新');
    }

    await this.rechargeEntity.update({ id }, { status: 2 });

    return { id, status: 2 };
  }

  /**
   * 用户端：我的充值记录
   * @param userId 用户ID
   * @param param 分页参数
   */
  async getMyList(userId: number, param: { page: number; size: number }) {
    const { page = 1, size = 10 } = param;

    const [list, total] = await this.rechargeEntity.findAndCount({
      where: { userId: Equal(userId) },
      order: { createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      list,
      pagination: { page, size, total },
    };
  }

  /**
   * 后台：充值列表
   * @param param 分页参数
   */
  async adminList(param: {
    page: number;
    size: number;
    userId?: number;
    status?: number;
  }) {
    const { page = 1, size = 10, userId, status } = param;

    const where: any = {};
    if (userId) where.userId = userId;
    if (status !== undefined) where.status = status;

    const [list, total] = await this.rechargeEntity.findAndCount({
      where,
      order: { createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      list,
      pagination: { page, size, total },
    };
  }
}
