import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户提现申请
 */
@Entity('user_withdraw')
export class UserWithdrawEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'bigint' })
  userId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '提现金额',
  })
  amount: number;

  @Column({
    comment: 'USDT钱包地址',
    length: 255,
  })
  walletAddress: string;

  @Column({
    comment: '状态',
    type: 'tinyint',
    default: 0,
    dict: ['审核中', '已完成', '已拒绝'],
  })
  status: number;

  @Column({ comment: '备注/拒绝原因', nullable: true, length: 255 })
  remark: string;
}
