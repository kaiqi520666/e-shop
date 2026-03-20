import { CoolController, BaseController } from '@cool-midway/core';
import { TopupNoticeEntity } from '../../entity/notice';

/**
 * 公告
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TopupNoticeEntity,
  pageQueryOp: {
    keyWordLikeFields: ['title'],
  },
})
export class AdminTopupNoticeController extends BaseController {}
