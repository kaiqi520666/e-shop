import { Post, Inject, Body } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ShopReviewService } from '../../service/review';

@CoolController()
export class AppShopReviewController extends BaseController {
  @Inject()
  shopReviewService: ShopReviewService;
  @Inject()
  ctx;

  @Post('/submit', { summary: '提交评价' })
  async submit(
    @Body('goodsId') goodsId: number,
    @Body('rating') rating: number,
    @Body('content') content?: string,
    @Body('images') images?: string[]
  ) {
    const userId = this.ctx.user.id;
    return this.ok(
      await this.shopReviewService.submit(
        userId,
        goodsId,
        rating,
        content,
        images
      )
    );
  }
}
