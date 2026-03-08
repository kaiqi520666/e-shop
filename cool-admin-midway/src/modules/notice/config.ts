import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '公告模块',
    description: '公告管理',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
