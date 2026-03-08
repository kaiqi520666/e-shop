import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 订单
 */
@Entity('shop_order')
export class ShopOrderEntity extends BaseEntity {
  @Index()
  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Index({ unique: true })
  @Column({ length: 32, comment: '订单号' })
  orderNo: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    comment: '订单总金额(USDT)',
  })
  totalUSDT: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '订单状态',
    dict: ['待支付', '已支付', '已发货', '已完成'],
  })
  status: number;

  @Column({ length: 500, nullable: true, comment: '收货地址' })
  address: string;
  //手机号
  @Column({ length: 11, nullable: true, comment: '手机号' })
  phone: string;
  //收货人
  @Column({ length: 100, nullable: true, comment: '收货人' })
  contact: string;
}
