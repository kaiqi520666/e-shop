import { Get, Inject, Query } from '@midwayjs/core';
import { CoolController, BaseController, CoolTag } from '@cool-midway/core';
import { ShopGoodsService } from '../../service/goods';

@CoolController()
export class OpenShopGoodsController extends BaseController {
  @Inject()
  shopGoodsService: ShopGoodsService;

  @Get('/list', { summary: '商品列表' })
  async getlist(@Query('categoryId') categoryId?: number) {
    return this.ok(await this.shopGoodsService.list(categoryId));
  }

  @Get('/info', { summary: '商品详情' })
  async getinfo(@Query('id') id: number) {
    return this.ok(await this.shopGoodsService.info(id));
  }
}
