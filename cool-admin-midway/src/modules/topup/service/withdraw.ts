import { Inject, Provide } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';

import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, QueryRunner, Repository } from 'typeorm';

import { TopupWithdrawEntity } from '../entity/withdraw';
import { UserInfoEntity } from '../../user/entity/info';
import { generateOrderNo } from '../../../utils';
import { UserTransactionService } from '../../user/service/transaction';
import { TopupTransactionEntity } from '../entity/transaction';
import { TopupTransactionService } from './transaction';

@Provide()
export class TopupWithdrawService extends BaseService {
  @InjectEntityModel(TopupWithdrawEntity)
  topupWithdrawEntity: Repository<TopupWithdrawEntity>;
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;
  @InjectEntityModel(TopupTransactionEntity)
  topupTransactionEntity: Repository<TopupTransactionEntity>;
  @Inject()
  topupTransactionService: TopupTransactionService;

  @Inject()
  userTransactionService: UserTransactionService;

  @Inject()
  ctx;
  @CoolTransaction({ connectionName: 'default' })
  async apply(param: { amount: number }, queryRunner?: QueryRunner) {
    const { amount } = param;
    const userId = Number(this.ctx.user.id);

    if (amount < 100) {
      throw new CoolCommException('提现金额必须大于100');
    }

    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: Equal(userId) },
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    if (Number(user.balance) < amount) {
      throw new CoolCommException('余额不足');
    }
    const fee = amount * 0.02;
    const actualAmount = amount - fee;
    await queryRunner.manager.decrement(
      UserInfoEntity,
      { id: userId },
      'balance',
      amount
    );
    await queryRunner.manager.increment(
      UserInfoEntity,
      { id: userId },
      'frozen',
      amount
    );
    const orderNo = generateOrderNo();
    const withdraw = await queryRunner.manager.save(TopupWithdrawEntity, {
      orderNo,
      userId,
      amount,
      actualAmount,
      fee,
      status: 0,
      remark: '申请提现',
      address: user.walletAddress,
    });
    await this.topupTransactionService.createTransaction(
      {
        userId,
        type: 1,
        amount: -amount,
        balanceBefore: Number(user.balance),
        balanceAfter: Number(user.balance) - amount,
        remark: '申请提现',
        status: 0,
        orderId: withdraw.id,
      },
      queryRunner
    );
    return { orderNo, status: 0 };
  }

  async getList(param: { page: number; size: number }) {
    const userId = Number(this.ctx.user.id);
    const { page = 1, size = 10 } = param;
    const [list, total] = await this.topupWithdrawEntity.findAndCount({
      where: { userId: Equal(userId) },
      order: { createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });
    return { list, pagination: { page, size, total } };
  }

  @CoolTransaction({ connectionName: 'default' })
  async cancel(param: { orderNo: string }, queryRunner?: QueryRunner) {
    const { orderNo } = param;
    const withdraw = await queryRunner.manager.findOne(TopupWithdrawEntity, {
      where: { orderNo: Equal(orderNo) },
    });
    if (!withdraw) {
      throw new CoolCommException('提现记录不存在');
    }
    if (withdraw.status !== 0) {
      throw new CoolCommException('只有待处理的提现记录才能取消');
    }
    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: Equal(withdraw.userId) },
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    const balanceBefore = Number(user.balance);
    const balanceAfter = Number(
      (balanceBefore + Number(withdraw.amount)).toFixed(2)
    );
    await queryRunner.manager.update(
      TopupWithdrawEntity,
      { orderNo: Equal(orderNo) },
      { status: 2 }
    );
    await queryRunner.manager.increment(
      UserInfoEntity,
      { id: withdraw.userId },
      'balance',
      withdraw.amount
    );
    await queryRunner.manager.decrement(
      UserInfoEntity,
      { id: withdraw.userId },
      'frozen',
      withdraw.amount
    );
    await this.topupTransactionService.createTransaction(
      {
        userId: withdraw.userId,
        type: 3,
        amount: withdraw.amount,
        balanceBefore,
        balanceAfter,
        remark: '退回提现金额',
        status: 1,
        orderId: withdraw.id,
      },
      queryRunner
    );
    await queryRunner.manager.update(
      TopupTransactionEntity,
      { orderId: Equal(withdraw.id), type: 1 },
      { status: 2, remark: '取消提现' }
    );
    return { orderNo, status: 2 };
  }

  @CoolTransaction({ connectionName: 'default' })
  async success(param: { orderNo: string }, queryRunner?: QueryRunner) {
    const { orderNo } = param;
    const withdraw = await queryRunner.manager.findOne(TopupWithdrawEntity, {
      where: { orderNo: Equal(orderNo) },
    });
    if (!withdraw) {
      throw new CoolCommException('提现记录不存在');
    }
    if (withdraw.status !== 0) {
      throw new CoolCommException('只有待处理的提现记录才能处理');
    }
    await queryRunner.manager.decrement(
      UserInfoEntity,
      { id: withdraw.userId },
      'frozen',
      withdraw.amount
    );
    await queryRunner.manager.update(
      TopupWithdrawEntity,
      { orderNo: Equal(orderNo) },
      { status: 1 }
    );
    await queryRunner.manager.update(
      TopupTransactionEntity,
      { orderId: Equal(withdraw.id) },
      { status: 1, remark: `提现${withdraw.actualAmount}USDT成功` }
    );
    return { orderNo, status: 1 };
  }
}
