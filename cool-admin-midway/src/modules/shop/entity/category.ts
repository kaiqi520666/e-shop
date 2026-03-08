import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shop_category')
export class ShopCategoryEntity extends BaseEntity {
  @Index()
  @Column({ length: 50, comment: '分类名称' })
  name: string;

  @Column({ length: 100, nullable: true, comment: '分类关键词', unique: true })
  keyword: string;

  @Column({ type: 'int', nullable: true, comment: '父分类ID' })
  parentId: number;

  //icon
  @Column({ length: 100, nullable: true, comment: '分类图标' })
  icon: string;

  @Column({ type: 'tinyint', default: 0, comment: '排序' })
  sort: number;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '状态',
    dict: ['隐藏', '显示'],
  })
  status: number;
}
