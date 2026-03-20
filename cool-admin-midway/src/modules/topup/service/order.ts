import { Inject, Provide } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { TopupOrderEntity } from '../entity/order';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, QueryRunner, Repository } from 'typeorm';
import { UserInfoEntity } from '../../user/entity/info';
import { TopupCategoryEntity } from '../entity/category';
import { AppConfigEntity } from '../../app/entity/config';
import { TopupTransactionEntity } from '../entity/transaction';
import { TopupTransactionService } from './transaction';
import { TopupCommissionService } from './commission';
import { generateOrderNo } from '../../../utils';
@Provide()
export class TopupOrderService extends BaseService {
  @InjectEntityModel(TopupOrderEntity)
  topupOrderEntity: Repository<TopupOrderEntity>;
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;
  @InjectEntityModel(TopupCategoryEntity)
  topupCategoryEntity: Repository<TopupCategoryEntity>;
  @InjectEntityModel(AppConfigEntity)
  appConfigEntity: Repository<AppConfigEntity>;
  @InjectEntityModel(TopupTransactionEntity)
  topupTransactionEntity: Repository<TopupTransactionEntity>;
  @Inject()
  topupTransactionService: TopupTransactionService;
  @Inject()
  topupCommissionService: TopupCommissionService;
  @Inject()
  ctx;

  /**
   * 创建订单
   */
  @CoolTransaction({ connectionName: 'default' })
  async createOrder(
    param: {
      rmbAmount: number;
      categoryId: number;
      phone?: string;
      name?: string;
      bank?: string;
      branch?: string;
      cardNo?: string;
      tg?: string;
      idCard?: string;
      address?: string;
      accountNo?: string;
    },
    queryRunner?: QueryRunner
  ) {
    const userId = this.getCurrentUserId();
    const {
      rmbAmount,
      categoryId,
      phone,
      name,
      bank,
      branch,
      cardNo,
      tg,
      idCard,
      address,
      accountNo,
    } = param;
    const category = await queryRunner.manager.findOne(TopupCategoryEntity, {
      where: { id: categoryId },
    });
    if (!category) {
      throw new CoolCommException('分类不存在');
    }
    const discount = category.discount;
    const usdtRateConfig = await queryRunner.manager.findOne(AppConfigEntity, {
      where: { cKey: 'usdt_rate' },
    });
    const usdtRate = Number(usdtRateConfig?.cValue) || 0;
    if (!usdtRate) {
      throw new CoolCommException('USDT汇率未配置，请联系管理员');
    }
    const usdtAmount = ((rmbAmount / usdtRate) * discount) / 10;
    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: userId },
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    if (user.balance < usdtAmount) {
      throw new CoolCommException('余额不足');
    }
    await queryRunner.manager.decrement(
      UserInfoEntity,
      { id: userId },
      'balance',
      usdtAmount
    );
    await queryRunner.manager.increment(
      UserInfoEntity,
      { id: userId },
      'frozen',
      usdtAmount
    );
    const orderNo = generateOrderNo();
    const order = await queryRunner.manager.save(TopupOrderEntity, {
      userId,
      orderNo,
      rmbAmount,
      usdtAmount,
      categoryId,
      phone,
      name,
      bank,
      branch,
      cardNo,
      tg,
      idCard,
      address,
      accountNo,
      discount,
    });
    //下单
    await this.topupTransactionService.createTransaction(
      {
        userId,
        type: 2,
        amount: -usdtAmount,
        balanceBefore: Number(user.balance),
        balanceAfter: Number(user.balance) - usdtAmount,
        remark: `下单消费${usdtAmount.toFixed(2)}USDT`,
        orderId: order.id,
      },
      queryRunner
    );
    return order;
  }
  //退款，订单状态必须为待充值
  @CoolTransaction({ connectionName: 'default' })
  async refundOrder(param: { orderNo: string }, queryRunner?: QueryRunner) {
    const { orderNo } = param;
    const order = await queryRunner.manager.findOne(TopupOrderEntity, {
      where: { orderNo },
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 0) {
      throw new CoolCommException('订单状态不正确');
    }
    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: order.userId },
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    await queryRunner.manager.increment(
      UserInfoEntity,
      { id: order.userId },
      'balance',
      order.usdtAmount
    );
    await queryRunner.manager.decrement(
      UserInfoEntity,
      { id: order.userId },
      'frozen',
      order.usdtAmount
    );
    await queryRunner.manager.update(
      TopupOrderEntity,
      { id: order.id },
      { status: 3 }
    );
    await this.topupTransactionService.createTransaction(
      {
        userId: order.userId,
        type: 3,
        amount: order.usdtAmount,
        balanceBefore: Number(user.balance),
        balanceAfter: Number(user.balance) + Number(order.usdtAmount),
        remark: `退款${order.usdtAmount.toFixed(2)}USDT`,
        orderId: order.id,
      },
      queryRunner
    );
    return order;
  }

  async getDetail(param: { orderNo: string }) {
    const { orderNo } = param;
    const userId = this.getCurrentUserId();
    const order = await this.topupOrderEntity
      .createQueryBuilder('order')
      .leftJoin(
        TopupCategoryEntity,
        'category',
        'order.categoryId = category.id'
      )
      .select([
        'order.id as id',
        'order.orderNo as orderNo',
        'order.rmbAmount as rmbAmount',
        'order.usdtAmount as usdtAmount',
        'order.status as status',
        'order.phone as phone',
        'order.name as name',
        'order.bank as bank',
        'order.branch as branch',
        'order.cardNo as cardNo',
        'order.discount as discount',
        'order.tg as tg',
        'order.idCard as idCard',
        'order.address as address',
        'order.accountNo as accountNo',
        'order.createTime as createTime',
        'order.categoryId as categoryId',
        'category.name as categoryName',
        'category.keyword as categoryKeyword',
      ])
      .where('order.orderNo = :orderNo and order.userId = :userId', {
        orderNo,
        userId,
      })
      .getRawOne();
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    return order;
  }
  async getList(param: { page: number; size: number; status?: number }) {
    const { page, size, status } = param;
    const userId = this.getCurrentUserId();
    const where: any = {};
    if (status !== undefined) where.status = status;
    const qb = this.topupOrderEntity
      .createQueryBuilder('order')
      .leftJoin(
        TopupCategoryEntity,
        'category',
        'order.categoryId = category.id'
      )
      .where('order.userId = :userId', { userId })
      .andWhere(where)
      .select([
        'order.id as id',
        'order.orderNo as orderNo',
        'order.rmbAmount as rmbAmount',
        'order.usdtAmount as usdtAmount',
        'order.status as status',
        'order.phone as phone',
        'order.name as name',
        'order.bank as bank',
        'order.branch as branch',
        'order.cardNo as cardNo',
        'order.discount as discount',
        'order.tg as tg',
        'order.idCard as idCard',
        'order.address as address',
        'order.accountNo as accountNo',
        'order.createTime as createTime',
        'order.categoryId as categoryId',
        'category.name as categoryName',
        'category.keyword as categoryKeyword',
      ])
      .orderBy('order.createTime', 'DESC');

    const total = await qb.getCount();
    const list = await qb
      .offset((page - 1) * size)
      .limit(size)
      .getRawMany();

    return { list, pagination: { page, size, total } };
  }

  @CoolTransaction({ connectionName: 'default' })
  async success(param: { id: number }, queryRunner?: QueryRunner) {
    const { id } = param;
    const order = await queryRunner.manager.findOne(TopupOrderEntity, {
      where: { id },
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 1) {
      throw new CoolCommException('订单状态不正确');
    }
    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: order.userId },
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    await queryRunner.manager.decrement(
      UserInfoEntity,
      { id: order.userId },
      'frozen',
      order.usdtAmount
    );
    await queryRunner.manager.update(TopupOrderEntity, { id }, { status: 2 });
    await this.topupCommissionService.calculateCommission(
      order.userId,
      order.id,
      order.usdtAmount,
      queryRunner
    );

    return order;
  }
  @CoolTransaction({ connectionName: 'default' })
  async cancelOrder(param: { id: number }, queryRunner?: QueryRunner) {
    const { id } = param;
    const currentUserId = this.getCurrentUserId();
    const order = await queryRunner.manager.findOne(TopupOrderEntity, {
      where: { id: Equal(id), userId: Equal(currentUserId) },
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 0) {
      throw new CoolCommException('订单状态不正确');
    }
    //30分钟后才能取消订单
    const createTime = new Date(order.createTime).getTime() + 30 * 60 * 1000;
    if (createTime > Date.now()) {
      throw new CoolCommException('下单后大于30分钟才能取消订单');
    }
    const user = await queryRunner.manager.findOne(UserInfoEntity, {
      where: { id: order.userId },
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    await queryRunner.manager.increment(
      UserInfoEntity,
      { id: order.userId },
      'balance',
      order.usdtAmount
    );
    await queryRunner.manager.decrement(
      UserInfoEntity,
      { id: order.userId },
      'frozen',
      order.usdtAmount
    );

    await queryRunner.manager.update(TopupOrderEntity, { id }, { status: 3 });
    await this.topupTransactionService.createTransaction(
      {
        type: 3,
        amount: order.usdtAmount,
        balanceBefore: Number(user.balance),
        balanceAfter: Number(user.balance) + Number(order.usdtAmount),
        remark: `退款${order.usdtAmount}USDT`,
        orderId: order.id,
        userId: order.userId,
      },
      queryRunner
    );
    return order;
  }
  async cumulative() {
    const userId = this.getCurrentUserId();
    const order = await this.topupOrderEntity
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .andWhere('order.status = 2')
      .select('SUM(order.usdtAmount)', 'total')
      .addSelect('COUNT(order.id)', 'count')
      .getRawOne();
    const commission = await this.topupTransactionEntity
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.type = 4')
      .select('SUM(transaction.amount)', 'amount')
      .getRawOne();
    return { order, commission };
  }
  /**
   * 获取当前用户ID
   */
  getCurrentUserId(): number {
    return this.ctx.user.id;
  }
}
