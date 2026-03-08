import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户充值记录
 */
@Entity('user_recharge')
export class UserRechargeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'bigint' })
  userId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '充值金额',
  })
  amount: number;

  @Index({ unique: true })
  @Column({ comment: '充值订单号', length: 32 })
  orderNo: string;

  @Column({
    comment: '状态 0=待充值 1=成功 2=超时',
    type: 'tinyint',
    default: 0,
  })
  status: number;

  @Column({ comment: '备注', nullable: true, length: 255 })
  remark: string;
}
