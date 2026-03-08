import { Provide, Inject } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, QueryRunner, Equal } from 'typeorm';
import { UserTransactionEntity } from '../entity/transaction';
import { UserInfoEntity } from '../entity/info';

/**
 * 用户交易记录
 */
@Provide()
export class UserTransactionService extends BaseService {
  @InjectEntityModel(UserTransactionEntity)
  transactionEntity: Repository<UserTransactionEntity>;

  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @Inject()
  ctx;

  /**
   * 用户端：获取当前用户交易记录
   * @param param 分页参数 { page, size }
   */
  async getList(param: { page: number; size: number }) {
    const { page = 1, size = 10 } = param;
    const userId = Number(this.ctx.user.id);

    const [list, total] = await this.transactionEntity.findAndCount({
      where: { userId },
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

  /**
   * 后台：获取所有用户交易记录
   * @param param 分页参数 { page, size, userId?, type? }
   */
  async adminGetList(param: {
    page: number;
    size: number;
    userId?: number;
    type?: number;
  }) {
    const { page = 1, size = 10, userId, type } = param;

    const queryBuilder = this.transactionEntity.createQueryBuilder('a');

    // JOIN user_info 返回用户名、手机号
    queryBuilder
      .leftJoinAndSelect('user_info', 'b', 'a.userId = b.id')
      .select([
        'a.id',
        'a.userId',
        'a.type',
        'a.amount',
        'a.balanceBefore',
        'a.balanceAfter',
        'a.orderId',
        'a.remark',
        'a.status',
        'a.createTime',
        'b.username',
        'b.phone',
      ]);

    // 筛选 userId
    if (userId) {
      queryBuilder.andWhere('a.userId = :userId', { userId: Number(userId) });
    }

    // 筛选 type
    if (type !== undefined && type !== null) {
      queryBuilder.andWhere('a.type = :type', { type: Number(type) });
    }

    // 按创建时间倒序
    queryBuilder.orderBy('a.createTime', 'DESC');

    // 分页
    queryBuilder.skip((page - 1) * size).take(size);

    const [list, total] = await queryBuilder.getManyAndCount();

    return {
      list,
      pagination: {
        page,
        size,
        total,
      },
    };
  }

  /**
   * 创建交易记录（供其他 Service 调用）
   * @param param 交易参数
   * @param queryRunner 可选的事务查询runner
   */
  async createTransaction(
    param: {
      userId: number;
      type: number;
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      orderId?: number;
      remark?: string;
      status?: number;
    },
    queryRunner?: QueryRunner
  ) {
    const data = {
      userId: Number(param.userId),
      type: Number(param.type),
      amount: Number(param.amount.toFixed(2)),
      balanceBefore: Number(param.balanceBefore.toFixed(2)),
      balanceAfter: Number(param.balanceAfter.toFixed(2)),
      orderId: param.orderId ? Number(param.orderId) : null,
      remark: param.remark || null,
      status: param.status ?? 1,
    };

    if (queryRunner) {
      // 事务中使用 queryRunner.manager
      await queryRunner.manager.insert(UserTransactionEntity, data);
    } else {
      // 直接写入
      await this.transactionEntity.insert(data);
    }

    return data;
  }

  /**
   * 更新交易记录状态
   * @param userId 用户ID
   * @param amount 金额（用于匹配记录）
   * @param status 状态
   */
  async updateTransactionStatus(
    userId: number,
    amount: number,
    status: number
  ) {
    // 查找最新的对应记录
    const transaction = await this.transactionEntity.findOne({
      where: {
        userId: Equal(Number(userId)),
        type: 1, // 提现
        amount: Equal(-Number(amount)),
      },
      order: { createTime: 'DESC' },
    });

    if (transaction) {
      await this.transactionEntity.update({ id: transaction.id }, { status });
    }
  }
}
