import { Post, Inject, Body } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ShopOrderService } from '../../service/order';

/**
 * 订单支付回调（开放端）
 */
@CoolController()
export class OpenShopOrderController extends BaseController {
  @Inject()
  shopOrderService: ShopOrderService;

  /**
   * Epusdt 异步回调
   * status: 0=创建 1=待支付 2=已支付(成功) 3=超时
   */
  @Post('/notify', { summary: '订单支付回调' })
  async handleNotify(
    @Body('trade_id') trade_id: string,
    @Body('status') status: number
  ) {
    // 通过 tradeId 查找订单
    const order = await this.shopOrderService.getOrderByTradeId(trade_id);

    if (!order) {
      console.log('【订单支付回调】订单不存在, tradeId:', trade_id);
      return 'order not found';
    }

    // 已处理过的订单不再处理（只有待支付状态才能处理）
    if (order.status !== 0) {
      console.log('【订单支付回调】订单已处理, status:', order.status);
      return 'ok';
    }

    if (status === 2) {
      // 支付成功
      console.log('【订单支付回调】支付成功, orderId:', order.id);

      try {
        // 完成订单：扣库存、结算佣金、清空购物车
        await this.shopOrderService.completeOrder(order.id);
        console.log('【订单支付回调】订单完成, orderId:', order.id);
      } catch (error) {
        console.error('【订单支付回调】完成订单失败:', error);
      }
    } else if (status === 3) {
      // 超时
      console.log('【订单支付回调】支付超时, orderId:', order.id);

      try {
        // 订单超时处理
        await this.shopOrderService.timeoutOrder(order.id);
        console.log('【订单支付回调】订单已标记为超时, orderId:', order.id);
      } catch (error) {
        console.error('【订单支付回调】超时处理失败:', error);
      }
    }

    return 'ok';
  }
}
