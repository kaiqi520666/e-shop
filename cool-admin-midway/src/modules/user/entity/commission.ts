import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户佣金
 */
@Entity('user_commission')
export class UserCommissionEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID', type: 'bigint' })
  orderId: number;

  @Index()
  @Column({ comment: '受益代理ID', type: 'bigint' })
  agentId: number;

  @Index()
  @Column({ comment: '消费用户ID', type: 'bigint' })
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '订单金额' })
  orderAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, comment: '分成比例' })
  rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '分成金额' })
  amount: number;

  @Column({ type: 'tinyint', comment: '距消费者层级数' })
  depth: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '状态',
    dict: ['待结算', '已结算'],
  })
  status: number;
}
