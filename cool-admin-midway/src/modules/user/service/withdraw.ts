import { Provide, Inject } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository, QueryRunner } from 'typeorm';
import { UserWithdrawEntity } from '../entity/withdraw';
import { UserInfoEntity } from '../entity/info';
import { UserTransactionService } from './transaction';
import * as md5 from 'md5';
/**
 * 用户提现
 */
@Provide()
export class UserWithdrawService extends BaseService {
  @InjectEntityModel(UserWithdrawEntity)
  withdrawEntity: Repository<UserWithdrawEntity>;

  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @Inject()
  userTransactionService: UserTransactionService;

  @Inject()
  ctx;

  /**
   * 申请提现
   * @param userId 用户ID
   * @param amount 金额
   * @param walletAddress 钱包地址
   */
  @CoolTransaction({ connectionName: 'default' })
  async apply(
    userId: number,
    amount: number,
    password: string,
    queryRunner?: QueryRunner
  ) {
    if (amount <= 0) {
      throw new CoolCommException('提现金额必须大于0');
    }

    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }

    // 校验钱包地址
    if (!user.walletAddress) {
      throw new CoolCommException('钱包地址不能为空');
    }
    if (!user.walletAddress.startsWith('T')) {
      throw new CoolCommException('钱包地址格式错误');
    }

    // 校验密码
    if (md5(password) !== user.password) {
      throw new CoolCommException('密码错误');
    }

    // 校验余额
    if (Number(user.balance) < amount) {
      throw new CoolCommException('余额不足');
    }

    const balanceBefore = Number(user.balance);
    const newBalance = Number((balanceBefore - amount).toFixed(2));

    // 扣减余额
    await this.userInfoEntity.decrement({ id: userId }, 'balance', amount);

    // 创建提现申请记录
    const withdraw = await this.withdrawEntity.save({
      userId,
      amount,
      walletAddress: user.walletAddress,
      status: 0, // 审核中
    });

    // 写入交易记录（提现，状态为处理中）
    await this.userTransactionService.createTransaction(
      {
        userId,
        type: 1, // 提现
        amount: -amount, // 支出
        balanceBefore,
        balanceAfter: newBalance,
        remark: '申请提现',
        status: 0, // 处理中
      },
      queryRunner
    );

    return withdraw;
  }

  /**
   * 审核通过
   * @param id 提现记录ID
   * @param remark 备注
   */
  async pass(id: number, remark?: string) {
    const withdraw = await this.withdrawEntity.findOneBy({ id });
    if (!withdraw) {
      throw new CoolCommException('提现记录不存在');
    }
    if (withdraw.status !== 0) {
      throw new CoolCommException('该提现记录状态已更新');
    }

    await this.withdrawEntity.update({ id }, { status: 1, remark });

    return { id, status: 1 };
  }

  /**
   * 审核拒绝
   * @param id 提现记录ID
   * @param remark 拒绝原因
   */
  @CoolTransaction({ connectionName: 'default' })
  async reject(id: number, remark: string, queryRunner?: QueryRunner) {
    const withdraw = await this.withdrawEntity.findOneBy({ id });
    if (!withdraw) {
      throw new CoolCommException('提现记录不存在');
    }
    if (withdraw.status !== 0) {
      throw new CoolCommException('该提现记录状态已更新');
    }

    // 恢复用户余额
    const user = await this.userInfoEntity.findOneBy({
      id: Equal(withdraw.userId),
    });
    const balanceBefore = Number(user.balance);
    const newBalance = Number(
      (balanceBefore + Number(withdraw.amount)).toFixed(2)
    );

    await this.userInfoEntity.increment(
      { id: withdraw.userId },
      'balance',
      Number(withdraw.amount)
    );

    // 更新提现记录状态
    await this.withdrawEntity.update({ id }, { status: 2, remark });

    // 更新交易记录状态为失败
    await this.userTransactionService.updateTransactionStatus(
      withdraw.userId,
      Number(withdraw.amount),
      2 // 失败
    );

    return { id, status: 2 };
  }

  /**
   * 完成打款
   * @param id 提现记录ID
   */
  async complete(id: number) {
    const withdraw = await this.withdrawEntity.findOneBy({ id });
    if (!withdraw) {
      throw new CoolCommException('提现记录不存在');
    }
    if (withdraw.status !== 1) {
      throw new CoolCommException('只有已审核通过的记录才能完成打款');
    }

    await this.withdrawEntity.update({ id }, { status: 2 });

    // 更新交易记录状态为成功
    await this.userTransactionService.updateTransactionStatus(
      withdraw.userId,
      Number(withdraw.amount),
      1 // 成功
    );

    return { id, status: 2 };
  }

  /**
   * 用户端：我的提现记录
   * @param userId 用户ID
   * @param param 分页参数
   */
  async getMyList(userId: number, param: { page: number; size: number }) {
    const { page = 1, size = 10 } = param;

    const [list, total] = await this.withdrawEntity.findAndCount({
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
   * 后台：提现列表
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

    const [list, total] = await this.withdrawEntity.findAndCount({
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
