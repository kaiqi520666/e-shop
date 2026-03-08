import { Get, Inject } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ShopCategoryService } from '../../service/category';

@CoolController()
export class OpenShopCategoryController extends BaseController {
  @Inject()
  shopCategoryService: ShopCategoryService;

  @Get('/list', { summary: '分类列表' })
  async list() {
    return this.ok(await this.shopCategoryService.list());
  }
}
