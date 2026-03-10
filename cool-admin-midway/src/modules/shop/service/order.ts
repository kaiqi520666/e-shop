import { Provide, Inject, HttpClient } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, MoreThan, Repository, QueryRunner } from 'typeorm';
import { ShopOrderEntity } from '../entity/order';
import { ShopOrderItemEntity } from '../entity/orderItem';
import { ShopCartEntity } from '../entity/cart';
import { ShopGoodsEntity } from '../entity/goods';
import { UserInfoEntity } from '../../user/entity/info';
import { UserCommissionEntity } from '../../user/entity/commission';
import { UserTransactionService } from '../../user/service/transaction';
import { UserRechargeService } from '../../user/service/recharge';
import { AppConfigEntity } from '../../app/entity/config';

@Provide()
export class ShopOrderService extends BaseService {
  @InjectEntityModel(ShopOrderEntity)
  orderEntity: Repository<ShopOrderEntity>;

  @InjectEntityModel(ShopOrderItemEntity)
  orderItemEntity: Repository<ShopOrderItemEntity>;

  @InjectEntityModel(ShopCartEntity)
  cartEntity: Repository<ShopCartEntity>;

  @InjectEntityModel(ShopGoodsEntity)
  goodsEntity: Repository<ShopGoodsEntity>;

  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @InjectEntityModel(UserCommissionEntity)
  commissionEntity: Repository<UserCommissionEntity>;

  @InjectEntityModel(AppConfigEntity)
  appConfigEntity: Repository<AppConfigEntity>;

  @Inject()
  userTransactionService: UserTransactionService;

  @Inject()
  userRechargeService: UserRechargeService;

  @Inject()
  ctx;

  /**
   * 生成订单号（时间戳+6位随机数）
   */
  private generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    return `${timestamp}${random}`;
  }

  /**
   * 获取当前用户ID
   */
  private getCurrentUserId(): number {
    return this.ctx.user.id;
  }

  /**
   * 创建订单
   * @param param { address: string, payType?: number }
   * payType: 1=余额支付 2=USDT扫码
   */
  @CoolTransaction({ connectionName: 'default' })
  async createOrder(
    param: {
      address: string;
      payType?: number;
      phone?: string;
      contact?: string;
    },
    queryRunner?: QueryRunner
  ) {
    const userId = this.getCurrentUserId();
    const { address, payType = 1, phone, contact } = param;

    // 0. 获取 USDT 汇率配置
    const usdtRateConfig = await this.appConfigEntity.findOne({
      where: { cKey: 'usdt_rate' },
    });
    const usdtRate = Number(usdtRateConfig?.cValue) || 0;
    if (!usdtRate) {
      throw new CoolCommException('USDT汇率未配置，请联系管理员');
    }

    // 1. 查询当前用户购物车记录，JOIN shop_goods 获取商品信息
    const cartItems = await this.cartEntity
      .createQueryBuilder('a')
      .select([
        'a.id as cartId',
        'a.productId as productId',
        'a.quantity as quantity',
        'b.name as productName',
        'b.image as productImage',
        'b.priceRMB as priceRMB',
        'b.stock as stock',
        'b.status as status',
      ])
      .innerJoin('shop_goods', 'b', 'a.productId = b.id')
      .where('a.userId = :userId', { userId })
      .getRawMany();

    // 2. 若购物车为空，抛出异常
    if (!cartItems || cartItems.length === 0) {
      throw new CoolCommException('购物车为空');
    }

    // 3. 校验每个商品 status=1，库存是否充足
    for (const item of cartItems) {
      if (item.status !== 1) {
        throw new CoolCommException(`商品 ${item.productName} 已下架`);
      }
      if (item.quantity > item.stock) {
        throw new CoolCommException(`商品 ${item.productName} 库存不足`);
      }
    }

    // 4. 计算 totalUSDT（使用 priceRMB / usdtRate 计算）
    let totalUSDT = 0;
    const orderItems = cartItems.map(item => {
      // 根据汇率计算 USDT 价格
      const calculatedPriceUSDT = Number((item.priceRMB / usdtRate).toFixed(4));
      const itemTotal = Number(
        (calculatedPriceUSDT * item.quantity).toFixed(4)
      );
      totalUSDT = Number((totalUSDT + itemTotal).toFixed(4));
      return {
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        priceUSDT: calculatedPriceUSDT,
        quantity: item.quantity,
        subtotalUSDT: itemTotal,
      };
    });

    // 5. 校验用户 balance >= totalUSDT (仅余额支付需要校验)
    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }

    // 区分处理：余额支付 vs USDT扫码
    if (payType === 1) {
      // 余额支付：校验并扣款
      if (Number(user.balance) < totalUSDT) {
        throw new CoolCommException('余额不足');
      }

      // 6. 扣减用户 balance，增加 frozen (balance -= totalUSDT, frozen += totalUSDT)
      const balanceBefore = Number(user.balance);
      const newBalance = Number(user.balance) - totalUSDT;
      const newFrozen = Number(user.frozen) + totalUSDT;
      await queryRunner.manager.update(
        UserInfoEntity,
        { id: userId },
        { balance: newBalance, frozen: newFrozen }
      );

      // 7. 扣减每个商品 stock
      for (const item of cartItems) {
        await queryRunner.manager.decrement(
          ShopGoodsEntity,
          { id: item.productId },
          'stock',
          item.quantity
        );
      }

      // 8. 生成订单号
      const orderNo = this.generateOrderNo();

      // 9. 写入 shop_order（先创建订单获取ID）
      const order = await queryRunner.manager.save(ShopOrderEntity, {
        userId,
        orderNo,
        totalUSDT,
        status: 1, // 已支付
        payType: 1,
        address,
        phone,
        contact,
      });

      // 9.1 写入交易记录（下单消费）
      await this.userTransactionService.createTransaction(
        {
          userId,
          type: 2, // 下单消费
          amount: -totalUSDT, // 支出
          balanceBefore,
          balanceAfter: newBalance,
          orderId: order.id,
          remark: `订单 ${orderNo} 消费`,
          status: 1,
        },
        queryRunner
      );

      // 10. 写入 shop_order_item
      const orderItemRecords = orderItems.map(item => ({
        orderId: order.id,
        ...item,
      }));
      await queryRunner.manager.save(ShopOrderItemEntity, orderItemRecords);

      // 11. 佣金分成（级差制）
      await this.calculateCommission(userId, order.id, totalUSDT, queryRunner);

      // 12. 清空购物车
      await queryRunner.manager.delete(ShopCartEntity, { userId });

      return {
        orderId: order.id,
        orderNo: order.orderNo,
        totalUSDT: order.totalUSDT,
        status: order.status,
        payType: order.payType,
      };
    } else {
      // USDT扫码支付：创建待支付订单
      return await this.createOrderByUSDT(
        userId,
        totalUSDT,
        address,
        phone,
        contact,
        orderItems,
        cartItems,
        usdtRate,
        queryRunner
      );
    }
  }

  /**
   * USDT扫码支付：创建待支付订单
   */
  private async createOrderByUSDT(
    userId: number,
    totalUSDT: number,
    address: string,
    phone: string,
    contact: string,
    orderItems: any[],
    cartItems: any[],
    usdtRate: number,
    queryRunner: QueryRunner
  ) {
    // 1. 生成订单号
    const orderNo = this.generateOrderNo();

    // 2. 计算人民币金额
    const amountCNY = Number((totalUSDT * usdtRate).toFixed(2));

    // 3. 调用 Epusdt API 创建支付订单
    const epusdtResult = await this.userRechargeService.createTransaction(
      userId,
      amountCNY,
      2
    );

    // 4. 创建待支付订单
    const order = await queryRunner.manager.save(ShopOrderEntity, {
      userId,
      orderNo,
      totalUSDT,
      status: 0, // 待支付
      payType: 2, // USDT扫码
      tradeId: epusdtResult.tradeId,
      address,
      phone,
      contact,
    });

    // 5. 预扣库存（用户转账成功后正式扣减）
    // 这里我们先不减库存，等支付成功后再扣

    // 6. 写入 shop_order_item（预创建）
    const orderItemRecords = orderItems.map(item => ({
      orderId: order.id,
      ...item,
    }));
    await queryRunner.manager.save(ShopOrderItemEntity, orderItemRecords);

    return {
      orderId: order.id,
      orderNo: order.orderNo,
      totalUSDT: order.totalUSDT,
      amountCNY, // 人民币金额
      status: order.status, // 0=待支付
      payType: order.payType, // 2=USDT扫码
      tradeId: order.tradeId,
      paymentUrl: epusdtResult.paymentUrl,
      expirationTime: epusdtResult.expirationTime,
    };
  }

  /**
   * 完成订单（支付成功后调用）
   * @param orderId 订单ID
   * @param queryRunner QueryRunner
   */
  @CoolTransaction({ connectionName: 'default' })
  async completeOrder(orderId: number, queryRunner?: QueryRunner) {
    // 1. 查询订单
    const order = await this.orderEntity.findOneBy({ id: orderId });
    if (!order || order.status !== 0) {
      return;
    }

    // 2. 查询购物车商品信息（用于扣库存）
    const orderItems = await this.orderItemEntity.find({
      where: { orderId },
    });

    // 3. 扣减每个商品 stock
    for (const item of orderItems) {
      await queryRunner.manager.decrement(
        ShopGoodsEntity,
        { id: item.productId },
        'stock',
        item.quantity
      );
    }

    // 4. 更新订单状态为已支付
    await queryRunner.manager.update(ShopOrderEntity, orderId, {
      status: 1, // 已支付
    });

    // 5. 佣金分成（级差制）
    await this.calculateCommission(
      order.userId,
      orderId,
      order.totalUSDT,
      queryRunner
    );

    // 6. 清空购物车
    await queryRunner.manager.delete(ShopCartEntity, { userId: order.userId });
  }

  /**
   * 订单超时处理
   * @param orderId 订单ID
   * @param queryRunner QueryRunner
   */
  async timeoutOrder(orderId: number, queryRunner?: QueryRunner) {
    const order = await this.orderEntity.findOneBy({ id: orderId });
    if (!order || order.status !== 0) {
      return;
    }

    // 更新订单状态为超时
    await queryRunner.manager.update(ShopOrderEntity, orderId, {
      status: 4, // 超时
    });

    // 删除订单商品记录
    await queryRunner.manager.delete(ShopOrderItemEntity, { orderId });
  }

  /**
   * 通过 tradeId 查询订单
   */
  async getOrderByTradeId(tradeId: string) {
    return await this.orderEntity.findOne({ where: { tradeId } });
  }

  /**
   * 计算订单佣金（级差制）
   * @param userId 消费者用户ID
   * @param orderId 订单ID
   * @param orderAmount 订单金额
   * @param queryRunner QueryRunner
   */
  private async calculateCommission(
    userId: number,
    orderId: number,
    orderAmount: number,
    queryRunner: QueryRunner
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
      await this.userTransactionService.createTransaction(
        {
          userId,
          type: 3, // 佣金收入
          amount,
          balanceBefore,
          balanceAfter,
          orderId,
          remark: '订单佣金返利',
          status: 1,
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
      await this.userTransactionService.createTransaction(
        {
          userId: ancestor.id,
          type: 3, // 佣金收入
          amount,
          balanceBefore,
          balanceAfter,
          orderId,
          remark: '下级订单佣金返利',
          status: 1,
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

  /**
   * 订单列表（分页）
   * @param query 查询参数
   */
  async getList(query: any) {
    const userId = this.getCurrentUserId();
    const { page = 1, size = 10 } = query;

    const [list, total] = await this.orderEntity.findAndCount({
      where: { userId: Equal(userId) },
      order: { createTime: 'DESC' },
      skip: (Number(page) - 1) * Number(size),
      take: Number(size),
      select: [
        'id',
        'orderNo',
        'totalUSDT',
        'status',
        'address',
        'createTime',
        'payType',
        'tradeId',
      ],
    });

    return {
      list,
      pagination: {
        page: Number(page),
        size: Number(size),
        total,
      },
    };
  }

  /**
   * 订单详情（含 items）
   * @param param { id: number }
   */
  async getDetail(param: { id: number }) {
    const userId = this.getCurrentUserId();
    const { id } = param;

    // 查询订单
    const order = await this.orderEntity.findOne({
      where: { id, userId: Equal(userId) },
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }

    // 查询订单商品
    const items = await this.orderItemEntity.find({
      where: { orderId: id },
      select: [
        'id',
        'productId',
        'productName',
        'productImage',
        'priceUSDT',
        'quantity',
        'subtotalUSDT',
      ],
    });

    return {
      ...order,
      items,
    };
  }

  /**
   * 查询订单支付状态（供前端轮询）
   * @param param { id: number }
   */
  async getPayStatus(param: { id: number }) {
    const userId = this.getCurrentUserId();
    const { id } = param;

    const order = await this.orderEntity.findOne({
      where: { id, userId: Equal(userId) },
      select: ['id', 'orderNo', 'status', 'payType', 'totalUSDT'],
    });

    if (!order) {
      throw new CoolCommException('订单不存在');
    }

    return {
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      payType: order.payType,
      totalUSDT: order.totalUSDT,
    };
  }
}
