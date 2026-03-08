import { CoolController, BaseController } from '@cool-midway/core';
import { ShopOrderEntity } from '../../entity/order';
import { ShopCategoryEntity } from '../../entity/category';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopOrderEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.name'],
    select: ['a.*'],
  },
})
export class AdminShopOrderController extends BaseController {}
