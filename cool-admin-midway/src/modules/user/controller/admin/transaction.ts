import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserTransactionEntity } from '../../entity/transaction';
import { UserTransactionService } from '../../service/transaction';
import { UserInfoEntity } from '../../entity/info';

/**
 * 用户交易记录-后台
 */
@CoolController({
  api: ['page', 'list', 'info'],
  entity: UserTransactionEntity,
  service: UserTransactionService,
  serviceApis: ['adminGetList'],
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
export class AdminUserTransactionController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userTransactionService: UserTransactionService;

  @Post('/getList', { summary: '获取交易记录列表' })
  async getList(
    @Body()
    param: {
      page: number;
      size: number;
      userId?: number;
      type?: number;
    }
  ) {
    return this.ok(await this.userTransactionService.adminGetList(param));
  }
}
