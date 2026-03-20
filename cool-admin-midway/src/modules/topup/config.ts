import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '充值模块',
    description: '充值管理',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
