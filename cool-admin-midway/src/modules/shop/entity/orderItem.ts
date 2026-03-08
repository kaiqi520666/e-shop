import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 订单商品
 */
@Entity('shop_order_item')
export class ShopOrderItemEntity extends BaseEntity {
  @Index()
  @Column({ type: 'bigint', comment: '订单ID' })
  orderId: number;

  @Column({ type: 'bigint', comment: '商品ID' })
  productId: number;

  @Column({ length: 200, comment: '商品名称' })
  productName: string;

  @Column({ length: 500, nullable: true, comment: '商品图片' })
  productImage: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    comment: '购买单价(USDT)',
  })
  priceUSDT: number;

  @Column({ type: 'int', comment: '购买数量' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    comment: '小计金额(USDT)',
  })
  subtotalUSDT: number;
}
