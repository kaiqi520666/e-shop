import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('notice_news')
export class NoticeNewsEntity extends BaseEntity {
  @Column({ type: 'varchar', comment: '标题' })
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
}
