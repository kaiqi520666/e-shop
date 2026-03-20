import { CoolController, BaseController } from '@cool-midway/core';
import { TopupCategoryEntity } from '../../entity/category';

/**
 * 充值分类
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TopupCategoryEntity,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
  },
})
export class AdminTopupCategoryController extends BaseController {}
