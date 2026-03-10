import { Provide, Inject } from '@midwayjs/core';
import { HttpClient } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository, QueryRunner } from 'typeorm';
import * as md5 from 'md5';
import { UserRechargeEntity } from '../entity/recharge';
import { UserInfoEntity } from '../entity/info';
import { UserTransactionService } from './transaction';
import { AppConfigEntity } from '../../app/entity/config';
import { HttpService } from '@midwayjs/axios';

/**
 * 用户充值
 */
@Provide()
export class UserRechargeService extends BaseService {
  @InjectEntityModel(UserRechargeEntity)
  rechargeEntity: Repository<UserRechargeEntity>;

  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @InjectEntityModel(AppConfigEntity)
  appConfigEntity: Repository<AppConfigEntity>;

  @Inject()
  userTransactionService: UserTransactionService;

  @Inject()
  httpService: HttpService;

  @Inject()
  ctx;

  // Epusdt 配置
  private readonly EPUSDT_API_URL =
    'https://upay.fdshop.top/api/v1/order/create-transaction';
  private readonly EPUSDT_TOKEN = 'epusdt_token';

  private readonly EPUSDT_CHECK_URL =
    'https://upay.fdshop.top/pay/check-status/';

  private readonly EPUSDT_RECHARGE_NOTIFY_URL =
    'https://api.fdshop.top/open/user/recharge/notify';

  private readonly EPUSDT_ORDER_NOTIFY_URL =
    'https://api.fdshop.top/open/shop/order/notify';
  /**
   * 生成签名
   */
  private generateSignature(params: Record<string, any>): string {
    const sortedKeys = Object.keys(params).sort();
    const signStr = sortedKeys
      .filter(
        key =>
          params[key] !== '' &&
          params[key] !== null &&
          params[key] !== undefined
      )
      .map(key => `${key}=${params[key]}`)
      .join('&');
    console.log('signStr', signStr);
    const signature = md5(signStr + this.EPUSDT_TOKEN);
    console.log('signature', signature);
    return signature;
  }

  /**
   * 创建 Epusdt 充值订单
   * @param userId 用户ID
   * @param amount 充值金额（CNY）
   * @param payType 支付方式
   */
  async createTransaction(userId: number, amount: number, payType: number) {
    if (amount <= 0) {
      throw new CoolCommException('充值金额必须大于0');
    }

    // 获取用户信息
    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }

    // 生成内部订单号
    const orderNo = this.generateOrderNo();

    // 获取回调地址（从配置中获取）
    // const notifyUrlConfig = await this.appConfigEntity.findOne({
    //   where: { cKey: 'recharge_notify_url' },
    // });
    const notifyUrl =
      payType === 1
        ? this.EPUSDT_RECHARGE_NOTIFY_URL
        : this.EPUSDT_ORDER_NOTIFY_URL;

    // 构建请求参数
    const params = {
      amount: amount,
      notify_url: notifyUrl,
      order_id: orderNo,
    };

    // 生成签名
    const signature = this.generateSignature(params);

    // 发送请求
    const result = await this.httpService.post(this.EPUSDT_API_URL, {
      amount,
      notify_url: notifyUrl,
      order_id: orderNo,
      signature,
    });

    const data = result.data;

    if (data.status_code !== 200) {
      throw new CoolCommException(data.message || '创建充值订单失败');
    }

    // 保存充值记录
    await this.rechargeEntity.save({
      userId,
      amount,
      orderNo,
      tradeId: data.data.trade_id,
      status: 0, // 待支付
    });

    return {
      orderNo,
      tradeId: data.data.trade_id,
      amount: data.data.amount,
      actualAmount: data.data.actual_amount,
      token: data.data.token,
      expirationTime: data.data.expiration_time,
      paymentUrl: data.data.payment_url,
    };
  }

  /**
   * 异步回调处理
   */
  async handleNotify(params: {
    trade_id: string;
    order_id: string;
    amount: number;
    actual_amount: number;
    token: string;
    signature: string;
    status: number;
  }) {
    const { trade_id, order_id, amount, actual_amount, status } = params;

    // 查找充值记录
    const recharge = await this.rechargeEntity.findOne({
      where: { orderNo: order_id },
    });

    if (!recharge) {
      return 'order not found';
    }

    // 已处理过的订单不再处理
    if (recharge.status !== 0) {
      return 'ok';
    }

    // 校验金额
    if (Number(recharge.amount) !== Number(amount)) {
      return 'amount mismatch';
    }

    // 支付成功
    if (status === 2) {
      const user = await this.userInfoEntity.findOneBy({
        id: Equal(recharge.userId),
      });
      if (!user) {
        return 'user not found';
      }

      const balanceBefore = Number(user.balance);
      const newBalance = Number(
        (balanceBefore + Number(actual_amount)).toFixed(4)
      );

      // 更新用户余额
      await this.userInfoEntity.increment(
        { id: recharge.userId },
        'balance',
        Number(actual_amount)
      );

      // 更新充值记录状态
      await this.rechargeEntity.update(
        { id: recharge.id },
        { status: 1, remark: `USDT实付: ${actual_amount}` }
      );

      // 写入交易记录
      await this.userTransactionService.createTransaction({
        userId: recharge.userId,
        type: 0, // 充值
        amount: Number(actual_amount),
        balanceBefore,
        balanceAfter: newBalance,
        remark: `充值成功，订单号: ${order_id}`,
        status: 1,
      });
    }

    return 'ok';
  }

  async checkTransaction(tradeId: string) {
    const result = await this.httpService.get(this.EPUSDT_CHECK_URL + tradeId);
    return result.data.data;
  }

  /**
   * 生成充值订单号
   */
  private generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp}${random}`;
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
