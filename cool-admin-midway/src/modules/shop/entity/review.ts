import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('shop_review')
export class ShopReviewEntity extends BaseEntity {
  @Column({ type: 'int', comment: '商品ID' })
  goodsId: number;

  @Column({ type: 'int', comment: '用户ID' })
  userId: number;

  @Column({ type: 'tinyint', comment: '评分 1-5' })
  rating: number;

  @Column({ type: 'text', nullable: true, comment: '评价内容' })
  content: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '图片',
    transformer: transformerJson,
  })
  images: string[];

  @Column({ type: 'int', default: 0, comment: '点赞数' })
  likeCount: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态 1-显示 0-隐藏' })
  status: number;
}
