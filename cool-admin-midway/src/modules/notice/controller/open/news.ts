import { CoolController, BaseController } from '@cool-midway/core';
import { NoticeNewsEntity } from '../../entity/news';
/**
 * 公告管理
 */
@CoolController({
  api: ['info', 'list'],
  entity: NoticeNewsEntity,
})
export class OpenNoticeNewsController extends BaseController {}
