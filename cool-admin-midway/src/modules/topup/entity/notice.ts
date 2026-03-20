import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 公告
 */
@Entity('topup_notice')
export class TopupNoticeEntity extends BaseEntity {
  @Column({ length: 255, comment: '标题' })
  title: string;

  @Column({ type: 'text', comment: '内容' })
  content: string;

  @Column({
    type: 'tinyint',
    comment: '状态',
    default: 1,
    dict: ['禁用', '启用'],
  })
  status: number;
  //摘要
  @Column({ length: 255, comment: '摘要' })
  summary: string;
}
