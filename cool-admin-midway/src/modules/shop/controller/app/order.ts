import { CoolController, BaseController } from '@cool-midway/core';
import { ShopOrderEntity } from '../../entity/order';
import { ShopOrderService } from '../../service/order';

@CoolController({
  api: ['page'],
  entity: ShopOrderEntity,
  service: ShopOrderService,
  serviceApis: ['createOrder', 'getList', 'getDetail', 'getPayStatus'],
  pageQueryOp: {
    keyWordLikeFields: ['a.orderNo'],
    fieldEq: ['a.status'],
  },
})
export class AppShopOrderController extends BaseController {}
