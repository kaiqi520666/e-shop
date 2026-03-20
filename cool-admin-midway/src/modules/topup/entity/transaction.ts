import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 充值交易记录
 */
@Entity('topup_transaction')
export class TopupTransactionEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'bigint' })
  userId: number;

  @Column({
    comment: '类型',
    type: 'tinyint',
    dict: ['充值', '提现', '下单', '退回', '佣金'],
  })
  type: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '金额（正数=收入 负数=支出）',
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '变动前余额',
  })
  balanceBefore: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '变动后余额',
  })
  balanceAfter: number;

  @Column({ comment: '关联订单ID', nullable: true, type: 'bigint' })
  orderId: number;

  @Column({ comment: '备注', nullable: true, length: 255 })
  remark: string;

  //状态
  @Column({
    type: 'tinyint',
    default: 1,
    comment: '状态',
    dict: ['处理中', '已完成', '已取消'],
  })
  status: number;
}
