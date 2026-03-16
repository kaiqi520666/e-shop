import {
  CoolController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
  BaseController,
} from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserLoginService } from '../../service/login';

/**
 * 登录
 */
@CoolUrlTag()
@CoolController()
export class AppUserAuthController extends BaseController {
  @Inject()
  userLoginService: UserLoginService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/refreshToken', { summary: '刷新token' })
  public async refreshToken(@Body('refreshToken') refreshToken) {
    return this.ok(await this.userLoginService.refreshToken(refreshToken));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/login', { summary: '登录' })
  async login(
    @Body('phone') phone: string,
    @Body('password') password: string
  ) {
    return this.ok(await this.userLoginService.login(phone, password));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/register', { summary: '注册' })
  async register(
    @Body('username') username: string,
    @Body('phone') phone: string,
    @Body('password') password: string,
    @Body('inviteCode') inviteCode?: string
  ) {
    return this.ok(
      await this.userLoginService.register(
        username,
        phone,
        password,
        inviteCode
      )
    );
  }
}
