import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('shop_banner')
export class ShopBannerEntity extends BaseEntity {
  @Column({ length: 500, comment: '图片URL' })
  image: string;

  @Column({ length: 100, nullable: true, comment: '标题' })
  title: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  //link
  @Column({ length: 100, nullable: true, comment: '链接' })
  link: string;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '状态',
    dict: ['隐藏', '显示'],
  })
  status: number;
}
