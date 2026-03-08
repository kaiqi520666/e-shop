import { CoolController, BaseController } from '@cool-midway/core';
import { NoticeNewsEntity } from '../../entity/news';
/**
 * 公告管理
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: NoticeNewsEntity,
  pageQueryOp: {
    keyWordLikeFields: ['title'],
  },
})
export class AdminNoticeNewsController extends BaseController {}
