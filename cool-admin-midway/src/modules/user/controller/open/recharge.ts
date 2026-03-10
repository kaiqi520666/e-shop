import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserRechargeService } from '../../service/recharge';

/**
 * 充值回调（开放接口）
 */
@CoolController({
  api: [],
})
export class OpenRechargeController extends BaseController {
  @Inject()
  userRechargeService: UserRechargeService;

  @Post('/notify', { summary: 'Epusdt异步回调' })
  async notify(
    @Body('trade_id') trade_id: string,
    @Body('status') status: number,
    @Body('order_id') order_id: string,
    @Body('amount') amount: number,
    @Body('actual_amount') actual_amount: number,
    @Body('token') token: string,
    @Body('signature') signature: string
  ): Promise<string> {
    return await this.userRechargeService.handleNotify({
      trade_id,
      status,
      order_id,
      amount,
      actual_amount,
      token,
      signature,
    });
  }
}
