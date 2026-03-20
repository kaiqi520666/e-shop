import { BaseController, CoolController } from '@cool-midway/core';
import { Get, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { TopupNoticeEntity } from '../../entity/notice';
import { Repository } from 'typeorm';

/**
 * 公告
 */
@CoolController({
  api: ['list'],
  entity: TopupNoticeEntity,
  listQueryOp: {
    select: ['id', 'title', 'summary', 'content', 'createTime'],
    where: async () => {
      return [['status = :status', { status: 1 }]];
    },
    addOrderBy: {
      createTime: 'DESC',
    },
  },
})
export class OpenTopupNoticeController extends BaseController {
  @InjectEntityModel(TopupNoticeEntity)
  topupNoticeEntity: Repository<TopupNoticeEntity>;

  @Get('/detail', { summary: '公告详情' })
  async detail(@Query('id') id: number) {
    const info = await this.topupNoticeEntity.findOne({
      select: ['id', 'title', 'summary', 'content', 'createTime'],
      where: { id, status: 1 },
    });
    if (!info) {
      return this.fail('公告不存在');
    }
    return this.ok(info);
  }
}
