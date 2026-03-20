import { CoolController, BaseController } from '@cool-midway/core';
import { TopupRechargeEntity } from '../../entity/recharge';
import { TopupRechargeService } from '../../service/recharge';
import { UserInfoEntity } from '../../../user/entity/info';

/**
 * 充值分类
 */
@CoolController({
  api: ['delete', 'update', 'info', 'list', 'page'],
  entity: TopupRechargeEntity,
  service: TopupRechargeService,
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
export class AdminTopupRechargeController extends BaseController {}
