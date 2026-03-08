import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { UserAgentService } from '../../service/agent';

/**
 * 用户代理
 */
@CoolController({
  api: [],
})
export class AppUserAgentController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  userAgentService: UserAgentService;

  @Post('/commissions', { summary: '获取佣金记录' })
  async commissions(@Body() query: any) {
    return this.ok(
      await this.userAgentService.commissions(this.ctx.user.id, query)
    );
  }

  @Get('/team', { summary: '获取团队成员' })
  async team() {
    return this.ok(await this.userAgentService.team(this.ctx.user.id));
  }

  @Post('/setSubRate', { summary: '设置下级分成比例' })
  async setSubRate(
    @Body('subUserId') subUserId: number,
    @Body('rate') rate: number
  ) {
    return this.ok(
      await this.userAgentService.setSubRate(this.ctx.user.id, subUserId, rate)
    );
  }

  @Get('/getSubUserCount', { summary: '获取除自己之外所有下级数量' })
  async getSubUserCount() {
    return this.ok(
      await this.userAgentService.getSubUserCount(this.ctx.user.id)
    );
  }
}
