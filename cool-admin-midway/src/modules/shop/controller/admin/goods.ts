import { CoolController, BaseController } from '@cool-midway/core';
import { ShopGoodsEntity } from '../../entity/goods';
import { ShopCategoryEntity } from '../../entity/category';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopGoodsEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.name'],
    select: ['a.*', 'b.name as categoryName'],
    join: [
      {
        entity: ShopCategoryEntity,
        alias: 'b',
        condition: 'a.categoryId = b.id',
        type: 'leftJoin',
      },
    ],
  },
})
export class AdminShopGoodsController extends BaseController {}
