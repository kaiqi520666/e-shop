import { CoolController, BaseController } from '@cool-midway/core';
import { TopupTransactionEntity } from '../../entity/transaction';
import { TopupTransactionService } from '../../service/transaction';

/**
 * 充值分类
 */
@CoolController({
  api: ['page'],
  entity: TopupTransactionEntity,
  service: TopupTransactionService,
  serviceApis: ['getList'],
})
export class AppTopupTransactionController extends BaseController {}
