import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shop_cart')
@Index(['userId', 'productId'], { unique: true })
export class ShopCartEntity extends BaseEntity {
  @Index()
  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ type: 'bigint', comment: '商品ID' })
  productId: number;

  @Column({ type: 'int', default: 1, comment: '数量' })
  quantity: number;
}
