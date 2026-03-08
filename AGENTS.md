# 电商项目文档

## 项目概述

这是一个**全栈电商项目**，采用典型的**前后端分离架构**，基于 **Cool-Admin** 快速开发框架构建。

## 项目组成

项目包含三个主要模块：

| 模块 | 描述 | 技术栈 |
|------|------|--------|
| `h5-app` | 移动端 H5 电商前端 | Vue 3 + Vue Router + Pinia + Tailwind CSS |
| `cool-admin-vue` | 后台管理系统 | Vue 3 + Element Plus + TypeScript |
| `cool-admin-midway` | 后端 API 服务 | Midway.js + TypeORM + MySQL |

## 核心功能模块

### 用户模块
- 登录、注册、个人中心
- 钱包管理（充值、提现）
- 代理功能（佣金管理）
- 收货地址管理
- 交易记录查询

### 商品模块
- 商品分类浏览
- 商品详情展示
- 购物车管理
- 订单创建与处理
- 商品评价

### 公告模块
- 公告列表展示
- 公告详情查看
- 底部导航入口

## H5 端路由结构

`h5-app/src/router/index.js` 定义了以下路由：

| 路径 | 名称 | 描述 | 需要登录 |
|------|------|------|----------|
| `/` | home | 首页 | 否 |
| `/login` | login | 登录页 | 否 |
| `/register` | register | 注册页 | 否 |
| `/category/:id?` | category | 商品分类页 | 否 |
| `/product/:id` | product | 商品详情页 | 否 |
| `/cart` | cart | 购物车 | 是 |
| `/checkout` | checkout | 结账页 | 是 |
| `/order-success` | orderSuccess | 订单成功页 | 是 |
| `/orders` | orderList | 订单列表 | 是 |
| `/orders/:id` | orderDetail | 订单详情 | 是 |
| `/profile` | profile | 个人中心 | 是 |
| `/recharge` | recharge | 充值 | 是 |
| `/withdraw` | withdraw | 提现 | 是 |
| `/agent` | agent | 代理中心 | 是 |
| `/transactions` | transactions | 交易记录 | 是 |
| `/address` | addressList | 地址列表 | 是 |
| `/address/form/:id?` | addressForm | 地址编辑 | 是 |
| `/notices` | notices | 公告列表 | 否 |
| `/notices/:id` | noticeDetail | 公告详情 | 否 |

## 技术特点

### H5 端
- 使用 Hash 路由（`createWebHashHistory`）
- 状态管理使用 Pinia + 持久化插件（`pinia-plugin-persistedstate`）
- UI 框架：Tailwind CSS 4.x + Lucide 图标
- 集成 rollup-plugin-visualizer 用于打包分析
- HTTP 客户端：Axios

### 后端 (cool-admin-midway)
- 基于 Midway.js 框架（Node.js + Koa）
- 使用 TypeORM 操作 MySQL 数据库
- 支持 JWT 认证
- 包含定时任务模块
- 支持文件上传

### 管理后台 (cool-admin-vue)
- 使用 @cool-vue/crud 快速生成 CRUD 页面
- 集成 ECharts 数据可视化
- 支持 i18n 多语言
- 使用 WangEditor 富文本编辑器

## 目录结构

```
e-commerce/
├── h5-app/                    # H5 移动端前端
│   ├── src/
│   │   ├── api/              # API 接口
│   │   ├── components/       # 公共组件
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── views/            # 页面视图
│   │   ├── router/           # 路由配置
│   │   ├── utils/            # 工具函数
│   │   ├── mock/             # Mock 数据
│   │   ├── main.js           # 入口文件
│   │   └── App.vue           # 根组件
│   ├── dist/                  # 打包产物
│   ├── package.json
│   └── vite.config.js
│
├── cool-admin-vue/           # 后台管理系统
│   ├── src/
│   │   ├── modules/          # 业务模块
│   │   ├── plugins/          # 插件配置
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
└── cool-admin-midway/        # 后端服务
    ├── src/
    │   ├── modules/          # 业务模块
    │   │   ├── user/         # 用户模块
    │   │   ├── shop/         # 商城模块
    │   │   └── task/         # 任务模块
    │   ├── config/           # 配置文件
    │   └── comm/             # 公共代码
    ├── package.json
    └── bootstrap.js
```

## 常用命令

### H5 端
```bash
cd h5-app
npm install          # 安装依赖
npm run dev          # 开发模式
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
```

### 后端服务
```bash
cd cool-admin-midway
npm install          # 安装依赖
npm run dev          # 开发模式
npm run build        # 构建
npm start            # 生产环境启动
```

### 管理后台
```bash
cd cool-admin-vue
npm install          # 安装依赖
npm run dev          # 开发模式
npm run build        # 构建生产版本
```

## 相关文件

- H5 端入口：`h5-app/src/main.js`
- H5 端路由：`h5-app/src/router/index.js`
- H5 端状态管理：`h5-app/src/stores/`
- 后端配置：`cool-admin-midway/src/config/config.default.ts`
