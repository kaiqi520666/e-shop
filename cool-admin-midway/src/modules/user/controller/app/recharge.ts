import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Param, Post, Query } from '@midwayjs/core';
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

  @Post('/apply', { summary: '申请充值（创建Epusdt订单）' })
  async apply(@Body('amount') amount: number) {
    return this.ok(
      await this.userRechargeService.createTransaction(
        Number(this.ctx.user.id),
        amount,
        1
      )
    );
  }

  @Post('/list', { summary: '我的充值记录' })
  async getlist(@Body() param: { page: number; size: number }) {
    return this.ok(
      await this.userRechargeService.getMyList(Number(this.ctx.user.id), param)
    );
  }

  @Get('/check/:tradeId', { summary: '检查充值状态' })
  async check(@Param('tradeId') tradeId: string) {
    return this.ok(await this.userRechargeService.checkTransaction(tradeId));
  }
}
