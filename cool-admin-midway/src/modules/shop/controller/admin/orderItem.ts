import { CoolController, BaseController } from '@cool-midway/core';
import { ShopOrderItemEntity } from '../../entity/orderItem';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopOrderItemEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.productName', 'a.orderId'],
    select: ['a.*'],
    where: async ctx => {
      return [['a.orderId = :orderId', { orderId: ctx.request.body.orderId }]];
    },
  },
})
export class AdminShopOrderItemController extends BaseController {}
