import { Inject, Provide } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';

import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, QueryRunner, Repository } from 'typeorm';

import { TopupRechargeEntity } from '../entity/recharge';
import {
  generateOrderNo,
  EPUSDT_API_URL,
  generateSignature,
  TOPUP_RECHARGE_NOTIFY_URL,
  EPUSDT_CHECK_URL,
} from '../../../utils';
import { HttpService } from '@midwayjs/axios';
import { UserInfoEntity } from '../../user/entity/info';
import { TopupTransactionService } from './transaction';

@Provide()
export class TopupRechargeService extends BaseService {
  @InjectEntityModel(TopupRechargeEntity)
  topupRechargeEntity: Repository<TopupRechargeEntity>;
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;
  @Inject()
  topupTransactionService: TopupTransactionService;
  @Inject()
  httpService: HttpService;
  @Inject()
  ctx;

  async apply(param: { amount: number }) {
    console.log('apply', param);
    const { amount } = param;
    const userId = Number(this.ctx.user.id);
    if (amount <= 0) {
      throw new CoolCommException('充值金额必须大于0');
    }

    const orderNo = generateOrderNo();

    const notifyUrl = TOPUP_RECHARGE_NOTIFY_URL;
    const params = {
      amount: amount,
      notify_url: notifyUrl,
      order_id: orderNo,
    };

    // 生成签名
    const signature = generateSignature(params);
    // 发送请求
    const result = await this.httpService.post(EPUSDT_API_URL, {
      amount,
      notify_url: notifyUrl,
      order_id: orderNo,
      signature,
    });

    const data = result.data;

    if (data.status_code !== 200) {
      throw new CoolCommException(data.message || '创建充值订单失败');
    }
    await this.topupRechargeEntity.save({
      userId,
      amount,
      orderNo,
      actualAmount: data.data.actual_amount,
      tradeId: data.data.trade_id,
      status: 0,
      token: data.data.token,
      expirationTime: data.data.expiration_time,
      paymentUrl: data.data.payment_url,
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
  @CoolTransaction({ connectionName: 'default' })
  async notify(
    param: {
      trade_id: string;
      status: number;
      actual_amount: number;
      amount: number;
      block_transaction_id: string;
      token: string;
      signature: string;
      order_id: string;
    },
    queryRunner?: QueryRunner
  ) {
    const {
      trade_id,
      status,
      actual_amount,
      amount,
      block_transaction_id,
      token,
      signature,
      order_id,
    } = param;

    // 签名验证
    if (
      signature !==
      generateSignature({
        trade_id,
        status,
        actual_amount,
        amount,
        block_transaction_id,
        token,
        order_id,
      })
    ) {
      throw new CoolCommException('签名错误');
    }

    // 查询充值订单
    const recharge = await queryRunner.manager.findOne(TopupRechargeEntity, {
      where: { tradeId: trade_id },
    });
    if (!recharge) {
      throw new CoolCommException('充值订单不存在');
    }
    if (recharge.status !== 0) {
      throw new CoolCommException('充值订单已处理');
    }

    // 根据状态处理
    if (status === 2) {
      // 充值成功
      const user = await queryRunner.manager.findOne(UserInfoEntity, {
        where: { id: Equal(recharge.userId) },
      });
      if (!user) {
        throw new CoolCommException('用户不存在');
      }
      const balanceBefore = Number(user.balance);
      const rechargeAmount = Number(actual_amount);
      await queryRunner.manager.increment(
        UserInfoEntity,
        { id: recharge.userId },
        'balance',
        rechargeAmount
      );
      const balanceAfter = Number((balanceBefore + rechargeAmount).toFixed(4));
      await this.topupTransactionService.createTransaction(
        {
          userId: recharge.userId,
          type: 0,
          amount: rechargeAmount,
          balanceBefore,
          balanceAfter,
          remark: '充值成功',
          status: 1,
        },
        queryRunner
      );
      // 更新充值订单状态为成功
      await queryRunner.manager.update(
        TopupRechargeEntity,
        { id: recharge.id },
        { status: 1, blockTransactionId: block_transaction_id }
      );
    } else if (status === 3) {
      // 充值超时/失败，仅更新订单状态
      await queryRunner.manager.update(
        TopupRechargeEntity,
        { id: recharge.id },
        { status: 2, blockTransactionId: block_transaction_id }
      );
    }

    // 直接返回纯文本
    this.ctx.res.statusCode = 200;
    this.ctx.res.setHeader('Content-Type', 'text/plain');
    this.ctx.res.write('ok');
    this.ctx.res.end();
    return;
  }
  async checkStatus(param: { tradeId: string }) {
    const { tradeId } = param;
    const userId = Number(this.ctx.user.id);

    const recharge = await this.topupRechargeEntity.findOne({
      where: { tradeId, userId },
    });
    if (!recharge) {
      throw new CoolCommException('充值订单不存在');
    }
    const result = await this.httpService.get(EPUSDT_CHECK_URL + tradeId);
    return result.data.data;
  }
}
