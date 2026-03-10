import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('app_config')
export class AppConfigEntity extends BaseEntity {
  @Column({ type: 'varchar', comment: '配置键' })
  cKey: string;

  @Column({ type: 'varchar', comment: '配置值' })
  cValue: string;

  @Column({ type: 'varchar', comment: '配置名称' })
  cName: string;
}
