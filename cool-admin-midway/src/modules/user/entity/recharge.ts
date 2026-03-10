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

  @Index({ unique: true })
  @Column({ comment: 'Epusdt交易号', length: 64, nullable: true })
  tradeId: string;

  @Column({
    comment: '状态',
    type: 'tinyint',
    default: 0,
    dict: ['待充值', '成功', '超时'],
  })
  status: number;

  @Column({ comment: '备注', nullable: true, length: 255 })
  remark: string;
}
