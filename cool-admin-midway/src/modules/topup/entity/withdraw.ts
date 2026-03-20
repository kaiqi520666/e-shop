import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 提现记录
 */
@Entity('topup_withdraw')
export class TopupWithdrawEntity extends BaseEntity {
  @Index()
  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Index({ unique: true })
  @Column({ length: 32, comment: '订单号' })
  orderNo: string;

  //amount
  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '金额' })
  amount: number;

  //actualAmount
  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '实际金额' })
  actualAmount: number;

  //fee
  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '手续费' })
  fee: number;

  //status
  @Column({
    type: 'tinyint',
    default: 0,
    comment: '状态',
    dict: ['待处理', '已处理', '已取消'],
  })
  status: number;

  //remark
  @Column({ length: 255, nullable: true, comment: '备注' })
  remark: string;

  //address
  @Column({ length: 255, nullable: true, comment: '提现地址' })
  address: string;
}
