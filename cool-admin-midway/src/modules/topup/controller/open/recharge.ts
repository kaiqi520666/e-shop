import { CoolController, BaseController } from '@cool-midway/core';
import { TopupRechargeEntity } from '../../entity/recharge';
import { TopupRechargeService } from '../../service/recharge';

/**
 * 充值
 */
@CoolController({
  api: [],
  entity: TopupRechargeEntity,
  service: TopupRechargeService,
  serviceApis: ['notify'],
})
export class OpenTopupRechargeController extends BaseController {}
