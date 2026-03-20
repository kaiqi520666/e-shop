# h5-topup

移动端充值 H5 前端项目，基于 Vue 3、Vite、Pinia、Vue Router 和 Tailwind CSS 构建。

项目当前聚焦资金与充值相关场景，覆盖首页业务入口、公告、订单、个人中心、USDT 充值、业务充值、提现、钱包地址管理、消费记录等页面。

开发和修改默认遵循 `AGENTS.md` 中的执行清单与高风险流程约束。

## 技术栈

- Vue 3
- Vite 7
- Vue Router 5
- Pinia 3
- pinia-plugin-persistedstate
- Tailwind CSS 4
- Axios
- lucide-vue-next

## 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- npm `>=10`

## 安装与启动

在项目根目录执行：

```bash
npm install
```

开发环境启动：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览：

```bash
npm run preview
```

代码检查：

```bash
npm run lint
```

格式化：

```bash
npm run format
```

## 目录结构

```text
h5-topup/
├── public/
├── src/
│   ├── api/                 # 接口封装
│   ├── assets/              # 全局样式与静态资源
│   ├── components/          # 公共组件
│   ├── composables/         # 复用逻辑
│   ├── constants/           # 常量数据
│   ├── mock/                # Mock 数据
│   ├── router/              # 路由配置
│   ├── services/            # UI / 会话服务
│   ├── stores/              # Pinia 状态管理（按 domain/resource/ui 分层）
│   ├── utils/               # 工具函数与业务 schema
│   ├── views/               # 页面视图
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

## 开发代理与接口说明

Vite 开发代理配置位于 [vite.config.js](/E:/App/cursor/e-commerce/h5-topup/vite.config.js)。

当前规则：

- 前端请求前缀：`/api`
- 代理目标：`http://127.0.0.1:8001`
- 转发时会去掉 `/api` 前缀

示例：

```text
前端请求: /api/app/user/auth/login
实际转发: http://127.0.0.1:8001/app/user/auth/login
```

首页轮播图当前由后端 `topup` 模块提供：

```text
前端请求: /api/open/topup/banner/list
实际转发: http://127.0.0.1:8001/open/topup/banner/list
```

## Axios 约定

统一请求实例位于 [src/api/index.js](/E:/App/cursor/e-commerce/h5-topup/src/api/index.js)。

当前行为：

- `baseURL` 为 `/api`
- 自动追加 `Authorization: Bearer <token>`
- 默认请求会触发全局 loading
- `code === 1000` 视为成功
- 非成功响应统一走 toast 提示
- `401` 会清理会话并跳转登录页

如果某次请求不希望显示全局 loading，可传入 `silent: true`：

```js
api.get('/app/user/info/person', { silent: true })
```

## 路由说明

路由配置位于 [src/router/index.js](/E:/App/cursor/e-commerce/h5-topup/src/router/index.js)。

项目当前使用 `createWebHistory`，部署时需要配置 SPA 回退。

### 页面路由

| 路径 | 名称 | 页面 | 是否公开 |
| --- | --- | --- | --- |
| `/` | `home` | `HomeView` | 是 |
| `/login` | `login` | `LoginView` | 是 |
| `/register` | `register` | `RegisterView` | 是 |
| `/notice` | `notice` | `NoticeView` | 是 |
| `/notice/:id` | `notice-detail` | `NoticeDetailView` | 是 |
| `/orders` | `orders` | `OrdersView` | 否 |
| `/orders/:orderNo` | `order-detail` | `OrderDetailView` | 否 |
| `/profile` | `profile` | `ProfileView` | 否 |
| `/agent` | `agent` | `AgentView` | 否 |
| `/recharge` | `recharge` | `RechargeView` | 否 |
| `/recharge/:type` | `business-recharge` | `BusinessRechargeView` | 否 |
| `/withdraw` | `withdraw` | `WithdrawView` | 否 |
| `/wallet` | `wallet` | `WalletView` | 否 |
| `/records` | `records` | `RecordsView` | 否 |

### 登录守卫

- 公开页面：`/`、`/notice`、`/notice/:id`、`/login`、`/register`
- 未登录访问受保护页面时，会跳转到 `/login?redirect=<原路径>`
- 登录成功后会优先回跳到 `redirect`
- 登录态统一以 `userStore.isLoggedIn` 判断

### 底部导航显示规则

底部导航逻辑位于 [src/App.vue](/E:/App/cursor/e-commerce/h5-topup/src/App.vue)。

当前仅以下页面显示底部导航：

- `/`
- `/notice`
- `/orders`
- `/profile`

## 状态管理

项目使用 Pinia，并通过 `pinia-plugin-persistedstate` 做本地持久化。

`src/stores/` 当前按职责拆分为三层：

- `domain/`：用户、订单、充值、提现、交易等业务域状态
- `resource/`：配置、分类、公告等资源型缓存状态
- `ui/`：toast、loading、confirm 等全局 UI 状态

导入约定：

- 默认统一从 `@/stores` 总出口导入
- 仅在需要实现细节或底层能力时，才直接从分层目录导入，如 `@/stores/domain/user`

主要 store：

- [src/stores/domain/user.js](/E:/App/cursor/e-commerce/h5-topup/src/stores/domain/user.js)
  - 登录
  - 用户信息获取与更新
  - 登出
- [src/stores/domain/order.js](/E:/App/cursor/e-commerce/h5-topup/src/stores/domain/order.js)
  - 订单创建、详情、列表、取消、统计
- [src/stores/resource/app.js](/E:/App/cursor/e-commerce/h5-topup/src/stores/resource/app.js)
  - 开放配置缓存
- [src/stores/resource/banner.js](/E:/App/cursor/e-commerce/h5-topup/src/stores/resource/banner.js)
  - 首页轮播图缓存
- [src/stores/resource/category.js](/E:/App/cursor/e-commerce/h5-topup/src/stores/resource/category.js)
  - 业务分类缓存
- [src/stores/resource/notice.js](/E:/App/cursor/e-commerce/h5-topup/src/stores/resource/notice.js)
  - 公告列表与轮播公告

## 资金流程说明

## 首页轮播图

首页轮播图不再固定写死在前端，改为从后端 `topup_banner` 配置读取。

当前字段约定：

```json
{
  "id": 1,
  "image": "https://xxx/banner-1.png",
  "title": "活动标题",
  "link": "/recharge",
  "sort": 10
}
```

前端行为约定：

- 只展示启用状态的轮播图
- 按后端排序字段展示
- `link` 为空时仅展示图片，不跳转
- `link` 为站内路径时使用前端路由跳转
- `link` 为 `http/https` 时按外链跳转
- 当后端未配置轮播图时，首页会回退到本地默认图，避免空白

### USDT 充值

- 先输入充值金额
- 确认后创建充值订单
- 系统返回充值地址、参考金额和过期时间
- 用户转账后手动确认
- 前端轮询订单状态并刷新余额

### 提现

- 提现前需要先绑定 TRC-20 钱包地址
- 前端会校验金额、余额和地址格式
- 提交前会弹出确认框，展示提现地址、手续费和预计到账金额
- 页面会对提交按钮加锁，避免重复申请

### 业务充值

- 按 `type` 使用 schema 驱动字段渲染与校验
- 不同业务类型会校验不同字段
- 下单前会确认业务类型、金额和预计支付 USDT
- 页面会对下单按钮加锁，避免重复创建订单

## 公告数据

当前公告数据来自本地 mock，数据源位于：

- [src/mock/notices.js](/E:/App/cursor/e-commerce/h5-topup/src/mock/notices.js)

公告 store 已和页面解耦，后续如切换到真实接口，可直接在 [src/stores/notice.js](/E:/App/cursor/e-commerce/h5-topup/src/stores/notice.js) 中替换加载逻辑。

## 部署说明

如果继续使用 `createWebHistory`，需要配置前端路由回退。

Nginx 示例：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}

location /api/ {
  proxy_pass http://127.0.0.1:8001/;
}
```

## 当前建议重点回归

- 登录、登出、未授权跳转与回跳
- USDT 充值的订单创建、复制、确认、轮询、超时处理
- 提现地址校验、确认弹窗、提交成功跳转
- 业务充值不同 `type` 的字段校验
- 订单列表、记录列表、公告列表的 loading / empty / error 三态
- 订单详情、公告详情的 loading / empty / error 三态
