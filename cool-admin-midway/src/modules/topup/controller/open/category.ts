import { CoolController, BaseController } from '@cool-midway/core';
import { TopupCategoryEntity } from '../../entity/category';

/**
 * 充值分类
 */
@CoolController({
  api: ['list'],
  entity: TopupCategoryEntity,
  listQueryOp: {
    select: ['id', 'name', 'keyword', 'description', 'discount'],
    where: async () => {
      return [['status = :status', { status: 1 }]];
    },
    addOrderBy: {
      sort: 'DESC',
    },
  },
})
export class OpenTopupCategoryController extends BaseController {}
