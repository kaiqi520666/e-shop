import { CoolController, BaseController } from '@cool-midway/core';
import { ShopCategoryEntity } from '../../entity/category';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopCategoryEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.name'],
    select: ['a.*'],
  },
})
export class AdminShopCategoryController extends BaseController {}
