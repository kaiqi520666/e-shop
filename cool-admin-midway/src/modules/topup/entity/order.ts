import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 订单
 */
@Entity('topup_order')
export class TopupOrderEntity extends BaseEntity {
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
    comment: 'USDT金额',
  })
  usdtAmount: number;
  //rmbAmount
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'RMB金额',
  })
  rmbAmount: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '订单状态',
    dict: ['等待充值', '正在充值', '充值成功', '订单取消'],
  })
  status: number;

  //手机号
  @Column({ length: 11, nullable: true, comment: '手机号' })
  phone: string;

  //姓名
  @Column({ length: 100, nullable: true, comment: '姓名' })
  name: string;

  //bank
  @Column({ length: 100, nullable: true, comment: '银行' })
  bank: string;

  //branch
  @Column({ length: 100, nullable: true, comment: '支行' })
  branch: string;

  //cardNo
  @Column({ length: 100, nullable: true, comment: '卡号' })
  cardNo: string;

  //tg
  @Column({ length: 100, nullable: true, comment: 'TG' })
  tg: string;

  //idCard
  @Column({ length: 100, nullable: true, comment: '身份证号' })
  idCard: string;

  @Column({ length: 500, nullable: true, comment: '详细地址' })
  address: string;

  //categoryId
  @Column({ type: 'bigint', nullable: true, comment: '分类ID' })
  categoryId: number;

  //accountNo
  @Column({ length: 100, nullable: true, comment: '户号' })
  accountNo: string;

  //折扣
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '折扣',
  })
  discount: number;
}
