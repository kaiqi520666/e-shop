import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserRechargeService } from '../../service/recharge';

/**
 * 用户充值
 */
@CoolController({
  api: [],
})
export class AppUserRechargeController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userRechargeService: UserRechargeService;

  @Post('/apply', { summary: '申请充值' })
  async apply(@Body('amount') amount: number) {
    return this.ok(
      await this.userRechargeService.apply(Number(this.ctx.user.id), amount)
    );
  }

  @Post('/list', { summary: '我的充值记录' })
  async getlist(@Body() param: { page: number; size: number }) {
    return this.ok(
      await this.userRechargeService.getMyList(Number(this.ctx.user.id), param)
    );
  }
}
