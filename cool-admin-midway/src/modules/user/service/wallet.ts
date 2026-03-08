import { Provide, Inject } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository, QueryRunner } from 'typeorm';
import { UserInfoEntity } from '../entity/info';
import { UserWalletLogEntity } from '../entity/walletLog';
import { UserTransactionService } from './transaction';
import { UserWithdrawService } from './withdraw';
import * as md5 from 'md5';
/**
 * 用户钱包
 */
@Provide()
export class UserWalletService extends BaseService {
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @InjectEntityModel(UserWalletLogEntity)
  walletLogEntity: Repository<UserWalletLogEntity>;

  @Inject()
  userTransactionService: UserTransactionService;

  @Inject()
  userWithdrawService: UserWithdrawService;

  /**
   * 获取钱包信息
   * @param userId 用户ID
   */
  async info(userId: number) {
    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    return {
      balance: user.balance,
      frozen: user.frozen,
      totalIncome: user.totalIncome,
      walletAddress: user.walletAddress,
    };
  }

  /**
   * 充值
   * @param userId 用户ID
   * @param amount 金额
   */
  @CoolTransaction({ connectionName: 'default' })
  async recharge(userId: number, amount: number, queryRunner?: QueryRunner) {
    if (amount <= 0) {
      throw new CoolCommException('充值金额必须大于0');
    }

    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }

    const balanceBefore = Number(user.balance);
    const newBalance = Number((balanceBefore + amount).toFixed(2));

    // 增加余额
    await this.userInfoEntity.increment({ id: userId }, 'balance', amount);

    // 写入日志
    await this.walletLogEntity.insert({
      userId,
      amount,
      type: 0,
      description: '充值',
    });

    // 写入交易记录
    await this.userTransactionService.createTransaction(
      {
        userId,
        type: 0, // 充值
        amount,
        balanceBefore,
        balanceAfter: newBalance,
        remark: '账户充值',
        status: 1,
      },
      queryRunner
    );

    return { balance: newBalance };
  }

  /**
   * 提现（已废弃，请使用 withdrawService.apply）
   * @param userId 用户ID
   * @param amount 金额
   */
  async withdraw(userId: number, amount: number) {
    // 提现功能已迁移到 withdrawService
    // 此方法保留以兼容旧代码
    throw new CoolCommException('请使用新接口申请提现');
  }

  /**
   * 绑定钱包地址
   * @param userId 用户ID
   * @param address 钱包地址
   */
  async bind(userId: number, address: string, password: string) {
    if (!address) {
      throw new CoolCommException('钱包地址不能为空');
    }
    // 校验钱包地址格式
    if (!address.startsWith('T')) {
      throw new CoolCommException('钱包地址格式错误');
    }

    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    if (!password) {
      throw new CoolCommException('密码不能为空');
    }

    // 校验密码
    if (md5(password) !== user.password) {
      throw new CoolCommException('密码错误');
    }

    await this.userInfoEntity.update(
      { id: userId },
      { walletAddress: address }
    );

    return { walletAddress: address };
  }

  /**
   * 获取交易记录
   * @param userId 用户ID
   * @param query 查询参数
   */
  async transactions(userId: number, query: any) {
    const { page = 1, size = 10 } = query;
    const [list, total] = await this.walletLogEntity.findAndCount({
      where: { userId: Equal(userId) },
      order: { createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      list,
      pagination: {
        page,
        size,
        total,
      },
    };
  }
}
