import { CoolController, BaseController } from '@cool-midway/core';
import { ShopReviewEntity } from '../../entity/review';
import { ShopGoodsEntity } from '../../entity/goods';
import { UserInfoEntity } from '../../../user/entity/info';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopReviewEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.name'],
    select: ['a.*', 'b.name as goodsName', 'c.username as username'],
    join: [
      {
        entity: ShopGoodsEntity,
        alias: 'b',
        condition: 'a.goodsId = b.id',
        type: 'leftJoin',
      },
      {
        entity: UserInfoEntity,
        alias: 'c',
        condition: 'a.userId = c.id',
        type: 'leftJoin',
      },
    ],
  },
})
export class AdminShopReviewController extends BaseController {}
