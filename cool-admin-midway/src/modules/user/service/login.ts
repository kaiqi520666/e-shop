import { Config, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { UserInfoEntity } from '../entity/info';
import * as jwt from 'jsonwebtoken';
import * as md5 from 'md5';

/**
 * 登录
 */
@Provide()
export class UserLoginService extends BaseService {
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @Config('module.user.jwt')
  jwtConfig;

  /**
   * 刷新token
   * @param refreshToken
   */
  async refreshToken(refreshToken) {
    try {
      const info = jwt.verify(refreshToken, this.jwtConfig.secret);
      if (!info['isRefresh']) {
        throw new CoolCommException('token类型非refreshToken');
      }
      const userInfo = await this.userInfoEntity.findOneBy({
        id: info['id'],
      });
      return this.token({ id: userInfo.id });
    } catch (e) {
      throw new CoolCommException(
        '刷新token失败，请检查refreshToken是否正确或过期'
      );
    }
  }

  /**
   * 密码登录
   * @param username
   * @param password
   */
  async login(username, password) {
    const user = await this.userInfoEntity.findOneBy({ username });

    if (user && user.password == md5(password)) {
      return this.token({
        id: user.id,
      });
    } else {
      throw new CoolCommException('账号或密码错误');
    }
  }

  /**
   * 注册
   * @param phone 手机号
   * @param password 密码
   * @param inviteCode 邀请码（可选）
   */
  async register(
    username: string,
    phone: string,
    password: string,
    inviteCode?: string
  ) {
    //用户名为A-Za-z0-9_，长度为6-16位
    if (!/^[A-Za-z0-9_]{6,16}$/.test(username)) {
      throw new CoolCommException('用户名格式错误');
    }

    // 2. 校验密码格式
    if (!/^[A-Za-z0-9_]{6,16}$/.test(password)) {
      throw new CoolCommException('密码格式错误');
    }

    // 3. 校验手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new CoolCommException('手机号格式错误');
    }

    // 1. 校验用户名唯一性
    const existUsername = await this.userInfoEntity.findOneBy({ username });
    if (existUsername) {
      throw new CoolCommException('用户名已注册');
    }

    // 2. 校验手机号唯一性
    const exist = await this.userInfoEntity.findOneBy({ phone });
    if (exist) {
      throw new CoolCommException('手机号已注册');
    }

    // 2. 密码 md5 加密
    const passwordHash = md5(password);

    // 3. 生成6位唯一邀请码
    const newInviteCode = await this.generateUniqueInviteCode();

    // 4. 处理邀请关系
    let parentId = null;
    let ancestorPath = '/';
    console.log('inviteCode:', JSON.stringify(inviteCode), typeof inviteCode);

    if (inviteCode && inviteCode.trim()) {
      const parent = await this.userInfoEntity.findOneBy({ inviteCode });
      if (parent) {
        parentId = parent.id;
        ancestorPath = parent.ancestorPath + parent.id + '/';
      } else {
        throw new CoolCommException('邀请码不存在');
      }
    }

    // 5. 创建用户
    const user = await this.userInfoEntity.save({
      username,
      phone,
      password: passwordHash,
      inviteCode: newInviteCode,
      parentId,
      ancestorPath,
    });

    // 6. 返回 token
    return this.token({ id: user.id });
  }

  /**
   * 生成唯一邀请码
   */
  private async generateUniqueInviteCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const length = 6;
    let retryCount = 0;
    const maxRetry = 3;

    while (retryCount < maxRetry) {
      let code = '';
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const exist = await this.userInfoEntity.findOneBy({ inviteCode: code });
      if (!exist) {
        return code;
      }
      retryCount++;
    }

    // 如果碰撞次数过多，使用时间戳+随机数
    return (
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
  }

  /**
   * 获得token
   * @param info
   * @returns
   */
  async token(info) {
    const { expire, refreshExpire } = this.jwtConfig;
    return {
      expire,
      token: await this.generateToken(info),
      refreshExpire,
      refreshToken: await this.generateToken(info, true),
    };
  }

  /**
   * 生成token
   * @param tokenInfo 信息
   * @param roleIds 角色集合
   */
  async generateToken(info, isRefresh = false) {
    const { expire, refreshExpire, secret } = this.jwtConfig;
    const user = await this.userInfoEntity.findOneBy({ id: Equal(info.id) });
    const tokenInfo = {
      isRefresh,
      ...info,
      tenantId: user?.tenantId,
    };
    return jwt.sign(tokenInfo, secret, {
      expiresIn: isRefresh ? refreshExpire : expire,
    });
  }
}
