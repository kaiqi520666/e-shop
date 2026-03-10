import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '配置模块',
    description: '配置管理',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
