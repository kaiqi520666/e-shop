import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserRechargeEntity } from '../../entity/recharge';
import { UserRechargeService } from '../../service/recharge';
import { UserInfoEntity } from '../../entity/info';

/**
 * 用户充值-后台
 */
@CoolController({
  api: ['page'],
  entity: UserRechargeEntity,
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
  service: UserRechargeService,
  serviceApis: ['adminList', 'complete', 'timeout'],
})
export class AdminUserRechargeController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userRechargeService: UserRechargeService;

  @Post('/list', { summary: '充值列表' })
  async getlist(
    @Body()
    param: {
      page: number;
      size: number;
      userId?: number;
      status?: number;
    }
  ) {
    return this.ok(await this.userRechargeService.adminList(param));
  }

  @Post('/complete', { summary: '确认充值成功' })
  async complete(@Body('id') id: number, @Body('remark') remark?: string) {
    return this.ok(await this.userRechargeService.complete(id, remark));
  }

  @Post('/timeout', { summary: '标记为超时' })
  async timeout(@Body('id') id: number) {
    return this.ok(await this.userRechargeService.timeout(id));
  }
}
