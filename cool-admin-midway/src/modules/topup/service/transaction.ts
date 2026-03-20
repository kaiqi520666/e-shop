import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';

import { InjectEntityModel } from '@midwayjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { TopupTransactionEntity } from '../entity/transaction';

@Provide()
export class TopupTransactionService extends BaseService {
  @InjectEntityModel(TopupTransactionEntity)
  topupTransactionEntity: Repository<TopupTransactionEntity>;
  @Inject()
  ctx;

  async getList(param: { page: number; size: number; type?: number }) {
    const { page, size, type } = param;
    const userId = this.ctx.user.id;
    const where: any = { userId };
    if (type !== undefined) where.type = type;
    const [list, total] = await this.topupTransactionEntity.findAndCount({
      where,
      order: { createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });
    return { list, pagination: { page, size, total } };
  }

  async createTransaction(
    param: {
      type: number;
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      remark: string;
      orderId?: number;
      status?: number;
      userId?: number;
    },
    queryRunner?: QueryRunner
  ) {
    const {
      type,
      amount,
      balanceBefore,
      balanceAfter,
      remark,
      orderId,
      status,
      userId,
    } = param;
    const data = {
      orderId: orderId ? orderId : null,
      userId: userId ? userId : this.ctx.user.id,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      remark,
      status: status ?? 1,
    };
    if (queryRunner) {
      await queryRunner.manager.insert(TopupTransactionEntity, data);
    } else {
      await this.topupTransactionEntity.save(data);
    }
    return data;
  }
  //记算佣金
}
