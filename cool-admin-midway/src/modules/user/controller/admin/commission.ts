import { CoolController, BaseController } from '@cool-midway/core';
import { UserCommissionEntity } from '../../entity/commission';
import { UserInfoEntity } from '../../entity/info';

/**
 * 用户佣金
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: UserCommissionEntity,
  pageQueryOp: {
    keyWordLikeFields: ['b.username'],
    select: ['a.*', 'b.username as username'],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
        type: 'leftJoin',
      },
    ],
  },
})
export class AdminUserCommissionController extends BaseController {}
