import { CoolController, BaseController } from '@cool-midway/core';
import { ShopBannerEntity } from '../../entity/banner';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopBannerEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    select: ['a.*'],
  },
})
export class AdminShopBannerController extends BaseController {}
