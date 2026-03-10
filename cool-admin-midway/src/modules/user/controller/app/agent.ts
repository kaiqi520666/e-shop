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
  //获取直属下级数量
  @Get('/directTeamCount', { summary: '获取直属下级数量' })
  async directTeamCount() {
    return this.ok(
      await this.userAgentService.directTeamCount(this.ctx.user.id)
    );
  }
  //获取团队成员
  @Get('/team', { summary: '获取团队成员' })
  async team() {
    return this.ok(await this.userAgentService.team(this.ctx.user.id));
  }
  //获取团队成员数量
  @Get('/teamCount', { summary: '获取团队成员数量' })
  async teamCount() {
    return this.ok(await this.userAgentService.teamCount(this.ctx.user.id));
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
}
