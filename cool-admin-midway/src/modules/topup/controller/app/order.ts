import { CoolController, BaseController } from '@cool-midway/core';
import { TopupOrderEntity } from '../../entity/order';
import { TopupOrderService } from '../../service/order';

/**
 * 充值分类
 */
@CoolController({
  api: ['page'],
  entity: TopupOrderEntity,
  service: TopupOrderService,
  serviceApis: [
    'createOrder',
    'getList',
    'getDetail',
    'cancelOrder',
    'cumulative',
  ],
})
export class AppTopupOrderController extends BaseController {}
