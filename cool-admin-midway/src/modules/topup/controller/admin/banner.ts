import { CoolController, BaseController } from '@cool-midway/core';
import { TopupBannerEntity } from '../../entity/banner';

/**
 * 轮播图
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TopupBannerEntity,
  pageQueryOp: {
    keyWordLikeFields: ['title', 'link'],
    addOrderBy: {
      sort: 'DESC',
      id: 'DESC',
    },
  },
})
export class AdminTopupBannerController extends BaseController {}
