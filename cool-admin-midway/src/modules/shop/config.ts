import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '商城模块',
    description: '商品、分类、轮播图、评价管理',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
