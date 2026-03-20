import { BaseService, CoolTransaction } from '@cool-midway/core';
import { Inject, Provide } from '@midwayjs/core';
import { Equal, In, MoreThan, QueryRunner } from 'typeorm';
import { UserInfoEntity } from '../../user/entity/info';
import { UserCommissionEntity } from '../../user/entity/commission';
import { TopupTransactionService } from './transaction';

@Provide()
export class TopupCommissionService extends BaseService {
  @Inject()
  topupTransactionService: TopupTransactionService;
  @Inject()
  ctx;

  /**
   * 计算订单佣金（级差制）
   * @param userId 消费者用户ID
   * @param orderId 订单ID
   * @param orderAmount 订单金额
   * @param queryRunner QueryRunner
   */
  @CoolTransaction({ connectionName: 'default' })
  public async calculateCommission(
    userId: number,
    orderId: number,
    orderAmount: number,
    queryRunner?: QueryRunner
  ) {
    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: Equal(userId) },
    });
    if (!user) return;
    // 消费者自己结算
    const consumerRate = Number(user.commissionRate);
    if (consumerRate > 0) {
      const rate = consumerRate / 100;
      const amount = Number((orderAmount * rate).toFixed(2));
      await queryRunner.manager.save(UserCommissionEntity, {
        orderId,
        agentId: userId,
        userId,
        orderAmount,
        rate,
        amount,
        depth: 0,
        status: 0,
      });

      // 变动前余额
      const balanceBefore = Number(user.balance);
      // 增加余额
      await queryRunner.manager.increment(
        UserInfoEntity,
        { id: userId },
        'balance',
        amount
      );
      // 变动后余额
      const balanceAfter = Number((balanceBefore + amount).toFixed(2));

      // 写入交易记录（佣金收入）
      await this.topupTransactionService.createTransaction(
        {
          type: 4, // 佣金收入
          amount,
          balanceBefore,
          balanceAfter,
          orderId,
          remark: '订单佣金返利',
          status: 1,
          userId,
        },
        queryRunner
      );
    }

    // 没有上级就结束
    if (!user.parentId) return;

    const ancestors = await this.getAncestors(userId, queryRunner);
    if (!ancestors.length) return;

    const chain = [user, ...ancestors];

    for (let i = 0; i < ancestors.length; i++) {
      const ancestor = ancestors[i];
      const ancestorRate = Number(ancestor.commissionRate);
      const lowerRate = Number(chain[i].commissionRate);

      // 级差除以100转成小数
      const diffRate = (ancestorRate - lowerRate) / 100;
      if (diffRate <= 0) continue;

      const amount = Number((orderAmount * diffRate).toFixed(2));

      await queryRunner.manager.save(UserCommissionEntity, {
        orderId,
        agentId: ancestor.id,
        userId,
        orderAmount,
        rate: diffRate,
        amount,
        depth: i + 1,
        status: 0,
      });

      // 变动前余额
      const balanceBefore = Number(ancestor.balance);
      // 增加余额
      await queryRunner.manager.increment(
        UserInfoEntity,
        { id: ancestor.id },
        'balance',
        amount
      );
      // 增加累计收入
      await queryRunner.manager.increment(
        UserInfoEntity,
        { id: ancestor.id },
        'totalIncome',
        amount
      );
      // 变动后余额
      const balanceAfter = Number((balanceBefore + amount).toFixed(2));

      // 写入交易记录（佣金收入）
      await this.topupTransactionService.createTransaction(
        {
          type: 4, // 佣金收入
          amount,
          balanceBefore,
          balanceAfter,
          orderId,
          remark: '下级订单佣金返利',
          status: 1,
          userId: ancestor.id,
        },
        queryRunner
      );
    }
  }
  /**
   * 获取用户的所有上级代理（按层级排序，从近到远）
   */
  private async getAncestors(
    userId: number,
    queryRunner: QueryRunner
  ): Promise<UserInfoEntity[]> {
    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: Equal(userId) },
    });
    if (!user || !user.parentId || user.ancestorPath === '/') return [];

    // 从 ancestorPath '/1/5/23/' 提取所有祖先ID
    const ancestorIds = user.ancestorPath
      .split('/')
      .filter(Boolean)
      .map(Number);

    if (!ancestorIds.length) return [];

    // 一次查出所有祖先
    const ancestors = await queryRunner.manager.find(UserInfoEntity, {
      where: [{ id: In(ancestorIds), commissionRate: MoreThan(0) }],
    });

    // 按 ancestorPath 中的顺序排列，然后反转（从近到远）
    const sorted = ancestorIds
      .map(id => ancestors.find(a => a.id === id))
      .filter(Boolean) as UserInfoEntity[];

    return sorted.reverse();
  }
}
