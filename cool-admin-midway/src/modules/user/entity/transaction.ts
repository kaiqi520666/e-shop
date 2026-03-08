import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户交易记录
 */
@Entity('user_transaction')
export class UserTransactionEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'bigint' })
  userId: number;

  @Column({
    comment: '类型',
    type: 'tinyint',
    dict: ['充值', '提现', '下单', '佣金'],
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

  @Column({
    comment: '状态',
    type: 'tinyint',
    default: 1,
    dict: ['处理中', '成功', '失败'],
  })
  status: number;
}
