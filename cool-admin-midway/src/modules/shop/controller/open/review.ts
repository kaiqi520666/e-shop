import { Get, Inject, Query } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ShopReviewService } from '../../service/review';

@CoolController()
export class OpenShopReviewController extends BaseController {
  @Inject()
  shopReviewService: ShopReviewService;

  @Get('/summary', { summary: '评价统计' })
  async summary(@Query('goodsId') goodsId: number) {
    return this.ok(await this.shopReviewService.summary(goodsId));
  }

  @Get('/list', { summary: '评价列表' })
  async getlist(
    @Query('goodsId') goodsId: number,
    @Query('limit') limit?: number
  ) {
    return this.ok(await this.shopReviewService.list(goodsId, limit));
  }
}
