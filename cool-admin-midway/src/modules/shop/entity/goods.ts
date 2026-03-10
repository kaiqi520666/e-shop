import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('shop_goods')
export class ShopGoodsEntity extends BaseEntity {
  @Column({ length: 200, comment: '商品名称' })
  name: string;

  @Column({ type: 'int', comment: '分类ID（叶子分类）' })
  categoryId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '人民币价格' })
  priceRMB: number;

  // @Column({ type: 'decimal', precision: 10, scale: 4, comment: 'USDT价格' })
  // priceUSDT: number;

  @Column({ type: 'int', default: 0, comment: '库存' })
  stock: number;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '状态',
    dict: ['下架', '上架'],
  })
  status: number;

  @Column({ length: 500, nullable: true, comment: '标签，逗号分隔' })
  tags: string;

  @Column({ type: 'text', nullable: true, comment: '商品描述' })
  description: string;

  @Column({ length: 500, nullable: true, comment: '主图URL' })
  image: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: '轮播图URL',
    transformer: transformerJson,
  })
  images: string[];

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;
}
