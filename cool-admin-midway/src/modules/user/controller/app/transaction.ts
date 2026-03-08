import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserTransactionEntity } from '../../entity/transaction';
import { UserTransactionService } from '../../service/transaction';

/**
 * 用户交易记录
 */
@CoolController({
  api: [],
  entity: UserTransactionEntity,
  service: UserTransactionService,
  serviceApis: ['getList'],
})
export class AppUserTransactionController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userTransactionService: UserTransactionService;

  @Post('/getList', { summary: '获取交易记录' })
  async getList(@Body() param: { page: number; size: number }) {
    return this.ok(await this.userTransactionService.getList(param));
  }
}
