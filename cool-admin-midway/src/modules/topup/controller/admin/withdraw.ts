import { CoolController, BaseController } from '@cool-midway/core';
import { TopupWithdrawEntity } from '../../entity/withdraw';
import { TopupWithdrawService } from '../../service/withdraw';
import { UserInfoEntity } from '../../../user/entity/info';

/**
 * 提现分类
 */
@CoolController({
  api: ['page', 'list', 'info', 'delete'],
  entity: TopupWithdrawEntity,
  service: TopupWithdrawService,
  serviceApis: ['cancel', 'success'],
  pageQueryOp: {
    keyWordLikeFields: ['orderNo'],
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
export class AdminTopupWithdrawController extends BaseController {}
