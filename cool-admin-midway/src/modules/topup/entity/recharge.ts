import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 充值记录
 */
@Entity('topup_recharge')
export class TopupRechargeEntity extends BaseEntity {
  @Index()
  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Index({ unique: true })
  @Column({ length: 32, comment: '订单号' })
  orderNo: string;

  //tradeId
  @Column({ length: 64, nullable: true, comment: 'Epusdt交易号' })
  tradeId: string;

  //amount
  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '金额' })
  amount: number;

  //actualAmount
  @Column({ type: 'decimal', precision: 10, scale: 4, comment: '实际金额' })
  actualAmount: number;

  //status
  @Column({
    type: 'tinyint',
    default: 0,
    comment: '状态',
    dict: ['待支付', '已支付', '已超时'],
  })
  status: number;

  //token
  @Column({ length: 100, nullable: true, comment: 'Token' })
  token: string;

  //expirationTime
  @Column({ type: 'bigint', nullable: true, comment: '过期时间' })
  expirationTime: number;

  //paymentUrl
  @Column({ length: 255, nullable: true, comment: '支付URL' })
  paymentUrl: string;

  //block_transaction_id
  @Column({ length: 64, nullable: true, comment: '区块交易ID' })
  blockTransactionId: string;
}
