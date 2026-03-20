import { CoolController, BaseController } from '@cool-midway/core';
import { TopupBannerEntity } from '../../entity/banner';

/**
 * 轮播图
 */
@CoolController({
  api: ['list'],
  entity: TopupBannerEntity,
  listQueryOp: {
    select: ['id', 'image', 'title', 'link', 'sort'],
    where: async () => {
      return [['status = :status', { status: 1 }]];
    },
    addOrderBy: {
      sort: 'DESC',
      id: 'DESC',
    },
  },
})
export class OpenTopupBannerController extends BaseController {}
