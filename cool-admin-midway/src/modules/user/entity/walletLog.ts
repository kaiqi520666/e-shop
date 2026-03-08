import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户钱包日志
 */
@Entity('user_wallet_log')
export class UserWalletLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '金额' })
  amount: number;

  @Column({
    comment: '类型',
    type: 'tinyint',
    dict: ['充值', '提现', '下单', '佣金'],
  })
  type: number;

  @Column({ nullable: true, comment: '描述', length: 100 })
  description: string;

  @Column({ nullable: true, comment: '订单ID', type: 'bigint' })
  orderId: number;

  @Column({ nullable: true, comment: '来源用户ID', type: 'bigint' })
  fromUserId: number;
}
