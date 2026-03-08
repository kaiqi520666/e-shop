import { CoolController, BaseController } from '@cool-midway/core';
import { Inject } from '@midwayjs/core';
import { ShopCartService } from '../../service/cart';
import { ShopCartEntity } from '../../entity/cart';

@CoolController({
  serviceApis: ['list', 'add', 'updateQuantity', 'remove', 'clear'],
  entity: ShopCartEntity,
  service: ShopCartService,
})
export class AppShopCartController extends BaseController {}
