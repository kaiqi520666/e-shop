import { CoolController, BaseController } from '@cool-midway/core';
import { TopupRechargeEntity } from '../../entity/recharge';
import { TopupRechargeService } from '../../service/recharge';

/**
 * 充值分类
 */
@CoolController({
  api: [],
  entity: TopupRechargeEntity,
  service: TopupRechargeService,
  serviceApis: ['apply', 'checkStatus'],
})
export class AppTopupRechargeController extends BaseController {}
