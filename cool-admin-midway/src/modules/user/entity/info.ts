import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户信息
 */
@Entity('user_info')
export class UserInfoEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '手机号', nullable: true, length: 11 })
  phone: string;

  @Column({ comment: '密码', nullable: true, length: 32 })
  password: string;

  @Column({ comment: '用户名', nullable: true, length: 50 })
  username: string;

  @Column({ comment: '头像', nullable: true, length: 255 })
  avatarUrl: string;

  @Column({
    comment: '状态',
    dict: ['禁用', '正常', '已注销'],
    default: 1,
    type: 'tinyint',
  })
  status: number;

  @Index({ unique: true })
  @Column({ comment: '邀请码', length: 6, nullable: true })
  inviteCode: string;

  @Column({ comment: '直属上级ID', nullable: true, type: 'bigint' })
  parentId: number;

  @Column({ comment: '祖先链', length: 500, default: '/' })
  ancestorPath: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    comment: '分成比例',
    default: 0,
  })
  commissionRate: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '可用余额',
    default: 0,
  })
  balance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '冻结金额',
    default: 0,
  })
  frozen: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '累计收入',
    default: 0,
  })
  totalIncome: number;

  @Column({ comment: 'TRC20钱包地址', nullable: true, length: 255 })
  walletAddress: string;
}
