import { Get } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';

@CoolController()
export class OpenShopWalletController extends BaseController {
  @Get('/address', { summary: '平台收款地址' })
  async address() {
    return this.ok({ address: 'T平台TRC20钱包地址' });
  }
}
