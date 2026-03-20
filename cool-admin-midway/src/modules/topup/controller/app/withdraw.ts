import { CoolController, BaseController } from '@cool-midway/core';
import { TopupWithdrawEntity } from '../../entity/withdraw';
import { TopupWithdrawService } from '../../service/withdraw';

/**
 * 提现分类
 */
@CoolController({
  api: [],
  entity: TopupWithdrawEntity,
  service: TopupWithdrawService,
  serviceApis: ['apply', 'getList'],
})
export class AppTopupWithdrawController extends BaseController {}
