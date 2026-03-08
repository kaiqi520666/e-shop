import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserWithdrawEntity } from '../../entity/withdraw';
import { UserWithdrawService } from '../../service/withdraw';
import { UserInfoEntity } from '../../entity/info';

/**
 * 用户提现-后台
 */
@CoolController({
  api: ['page', 'list', 'info', 'delete'],
  entity: UserWithdrawEntity,
  service: UserWithdrawService,
  serviceApis: ['adminList', 'pass', 'reject', 'complete'],
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
export class AdminUserWithdrawController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userWithdrawService: UserWithdrawService;

  @Post('/list', { summary: '提现列表' })
  async getlist(
    @Body()
    param: {
      page: number;
      size: number;
      userId?: number;
      status?: number;
    }
  ) {
    return this.ok(await this.userWithdrawService.adminList(param));
  }

  @Post('/pass', { summary: '审核通过' })
  async pass(@Body('id') id: number, @Body('remark') remark?: string) {
    return this.ok(await this.userWithdrawService.pass(id, remark));
  }

  @Post('/reject', { summary: '审核拒绝' })
  async reject(@Body('id') id: number, @Body('remark') remark: string) {
    return this.ok(await this.userWithdrawService.reject(id, remark));
  }

  @Post('/complete', { summary: '完成打款' })
  async complete(@Body('id') id: number) {
    return this.ok(await this.userWithdrawService.complete(id));
  }
}
