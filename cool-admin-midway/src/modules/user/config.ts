import { ModuleConfig } from '@cool-midway/core';
import { UserMiddleware } from './middleware/app';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '用户模块',
    // 模块描述
    description: '用户模块',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [UserMiddleware],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // jwt
    jwt: {
      // token 过期时间，单位秒
      expire: 60 * 60 * 24,
      // 刷新token 过期时间，单位秒
      refreshExpire: 60 * 60 * 24 * 30,
      // jwt 秘钥
      secret: '7529a7e7-e04e-4472-b6ba-06b4fabb99bcx',
    },
  } as ModuleConfig;
};
