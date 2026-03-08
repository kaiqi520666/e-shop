import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserWithdrawService } from '../../service/withdraw';

/**
 * 用户提现
 */
@CoolController({
  api: [],
})
export class AppUserWithdrawController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userWithdrawService: UserWithdrawService;

  @Post('/apply', { summary: '申请提现' })
  async apply(
    @Body('amount') amount: number,
    @Body('password') password: string
  ) {
    return this.ok(
      await this.userWithdrawService.apply(
        Number(this.ctx.user.id),
        amount,
        password
      )
    );
  }

  @Post('/list', { summary: '我的提现记录' })
  async getlist(@Body() param: { page: number; size: number }) {
    return this.ok(
      await this.userWithdrawService.getMyList(Number(this.ctx.user.id), param)
    );
  }
}
