import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { UserWalletService } from '../../service/wallet';
import { UserWithdrawService } from '../../service/withdraw';

/**
 * 用户钱包
 */
@CoolController({
  api: [],
})
export class AppUserWalletController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userWalletService: UserWalletService;

  @Inject()
  userWithdrawService: UserWithdrawService;

  @Get('/info', { summary: '获取钱包信息' })
  async info() {
    return this.ok(await this.userWalletService.info(this.ctx.user.id));
  }

  @Post('/recharge', { summary: '充值' })
  async recharge(@Body('amount') amount: number) {
    return this.ok(
      await this.userWalletService.recharge(this.ctx.user.id, amount)
    );
  }

  @Post('/withdraw', { summary: '申请提现' })
  async withdraw(
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

  @Post('/withdraw/list', { summary: '我的提现记录' })
  async withdrawList(@Body() param: { page: number; size: number }) {
    return this.ok(
      await this.userWithdrawService.getMyList(Number(this.ctx.user.id), param)
    );
  }

  @Post('/bind', { summary: '绑定钱包地址' })
  async bind(
    @Body('address') address: string,
    @Body('password') password: string
  ) {
    return this.ok(
      await this.userWalletService.bind(this.ctx.user.id, address, password)
    );
  }

  @Post('/transactions', { summary: '获取交易记录' })
  async transactions(@Body() query: any) {
    return this.ok(
      await this.userWalletService.transactions(this.ctx.user.id, query)
    );
  }
}
