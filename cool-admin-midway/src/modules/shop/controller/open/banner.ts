import { Get, Inject } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ShopBannerService } from '../../service/banner';

@CoolController()
export class OpenShopBannerController extends BaseController {
  @Inject()
  shopBannerService: ShopBannerService;

  @Get('/list', { summary: '轮播图列表' })
  async list() {
    return this.ok(await this.shopBannerService.list());
  }
}
