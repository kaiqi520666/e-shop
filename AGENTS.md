# AGENTS.md

本文件只针对 `cool-admin-midway` 和 `h5-topup` 两个项目生效。目标是让 AI/代理在这个仓库内工作时，优先贴合这两个项目的真实结构与业务边界，避免把旧文档中的 `h5-app` 或无关的 `cool-admin-vue` 习惯带进来。

## 0. 作用范围

- 后端：`cool-admin-midway`
- 前端：`h5-topup`
- 非本次重点：
  - `cool-admin-vue`
  - `h5-app`

如果任务同时涉及多个目录，默认只关注上述两个项目；除非用户明确要求，否则不要顺手修改其他项目。

## 1. 执行原则

1. 先读相关代码，再改代码，不凭框架印象下判断。
2. 优先做与当前任务直接相关的最小改动，不顺手重构无关模块。
3. 保持项目现有技术栈和风格，不默认引入新框架、新状态层或大规模目录重组。
4. 涉及充值、提现、订单、余额、佣金、钱包地址、交易流水时，按高风险资金流程处理，不能静默改变行为。
5. 前后端联动改动必须同时检查接口路径、鉴权方式、字段命名、成功码约定和错误提示。
6. 所有文件保持 UTF-8；读取文件时在 Windows 下统一使用 `Get-Content <路径> -Encoding UTF8`，禁止使用 `cat`、`type` 读取源码。
7. 改动完成后优先做最小闭环验证；如果无法执行命令或验证，要明确说明。
8. 只要本次改动形成了新的“项目级事实”或长期约束，就必须同步写入 `AGENTS.md`，避免后续代理继续按旧事实工作。

## 2. 仓库现状

### 2.1 `h5-topup`

- 技术栈：Vue 3、Vite 7、Vue Router 5、Pinia 3、pinia-plugin-persistedstate、Tailwind CSS 4、Axios
- 语言：以 JavaScript + `<script setup>` 为主
- 入口：`h5-topup/src/main.js`
- 路由：`h5-topup/src/router/index.js`
- 请求封装：`h5-topup/src/api/index.js`
- 状态总出口：`h5-topup/src/stores/index.js`
- Vite 代理：`/api -> http://127.0.0.1:8001`，并去掉 `/api` 前缀
- 当前使用 `createWebHistory`，部署时需要 SPA fallback

### 2.2 `cool-admin-midway`

- 技术栈：Midway.js、TypeScript、TypeORM、MySQL、Cool-Admin
- 入口：`cool-admin-midway/bootstrap.js`
- 全局配置：`cool-admin-midway/src/config/config.default.ts`
- 本地数据库配置：`cool-admin-midway/src/config/config.local.ts`
- 生产配置：`cool-admin-midway/src/config/config.prod.ts`
- 当前默认端口：`8001`
- 主要业务模块：
  - `src/modules/topup`
  - `src/modules/user`
  - `src/modules/app`
  - `src/modules/shop`

## 3. 前后端对接约定

### 3.1 前端请求约定

- 前端统一通过 `h5-topup/src/api/index.js` 的 Axios 实例发请求。
- 默认 `baseURL` 为 `/api`。
- 登录后自动追加 `Authorization: Bearer <token>`。
- 默认会触发全局 loading；如确实不需要，再使用 `silent: true`。
- 响应 `code === 1000` 视为成功。
- `401` 会触发会话失效处理，清理状态并跳转登录。

### 3.2 后端接口前缀约定

Cool-Admin 按前缀区分接口边界：

- `admin`：后台管理接口
- `app`：前台登录用户接口
- `open`：公开接口

修改控制器时必须先确认前缀是否正确，尤其是：

- `h5-topup` 调用登录后接口时，对应后端应落在 `/app/**`
- 公告、分类、开放配置等无需登录的接口，应优先落在 `/open/**`
- 不要把面向 H5 的接口误挂到 `admin`

### 3.3 登录态与鉴权

- 前端登录态核心在 `h5-topup/src/stores/domain/user.js`
- 路由守卫在 `h5-topup/src/router/index.js`
- 后端 H5 登录鉴权核心在 `cool-admin-midway/src/modules/user/middleware/app.ts`

修改鉴权相关逻辑时，必须同时检查：

- token 写入与读取
- `401` 返回行为
- 路由跳转与 redirect 回跳
- `open` 接口是否仍可匿名访问

## 4. `h5-topup` 目录职责

- `src/views/`：页面级视图
- `src/components/`：可复用组件
- `src/composables/`：可复用视图逻辑
- `src/api/modules/**`：接口定义
- `src/stores/domain/`：用户、订单、充值、提现、交易等业务状态
- `src/stores/resource/`：配置、分类、公告等资源缓存
- `src/stores/ui/`：toast、loading、confirm 等 UI 状态
- `src/services/`：UI 能力与会话处理
- `src/utils/`：工具函数与业务 schema

前端改动时遵守以下约束：

- 不要在页面里直接写裸 Axios 请求，统一走 `src/api/modules/**`
- 不要把页面私有逻辑塞进全局 store
- 默认从 `@/stores` 总出口导入 store
- 保持现有深色 + 荧光绿主色的移动端视觉语言，不要引入明显冲突的桌面后台风格
- 首页轮播图属于后端配置资源，统一走 `/open/topup/banner/list` 和 `src/stores/resource/banner.js`
- 禁止在 `h5-topup/src/views/HomeView.vue` 重新写死业务轮播图数据；本地图片只作为接口无数据时的兜底
- `h5-topup/src/views/ProfileView.vue` 存在“同步数据”入口：用于清理资源型缓存并强制重新向服务器拉取关键数据，不应误改为退出登录、清空全部 store 或只做本地刷新

## 5. `cool-admin-midway` 目录职责

- `src/modules/topup/controller/`：充值、提现、订单、分类、公告、首页轮播图等接口入口
- `src/modules/topup/service/`：充值业务、提现业务、订单业务、佣金、交易
- `src/modules/topup/entity/`：topup 相关实体，以及 H5 首页轮播图 `banner`
- `src/modules/user/controller/`：用户信息、认证、地址、钱包、代理等接口
- `src/modules/user/service/`：登录、用户信息、钱包、提现、代理、交易
- `src/config/`：环境配置
- `src/utils/`：订单号、签名、三方充值参数等工具

后端改动时遵守以下约束：

- 新增业务逻辑优先放 service，不要把复杂逻辑塞进 controller
- 资金、状态流转、余额冻结/解冻、佣金结算必须放事务中
- 多表查询时明确 `select` 字段，避免字段冲突和无意暴露敏感字段
- 不要吞异常；如捕获异常，必须明确转换、记录或继续抛出
- 涉及 SQL 拼接时必须参数化，避免注入风险
- 生产环境不要把 `synchronize` 改回 `true`

## 6. 高风险流程

以下内容默认按高风险资金流程处理：

### 6.1 前端

- `h5-topup/src/views/RechargeView.vue`
- `h5-topup/src/views/BusinessRechargeView.vue`
- `h5-topup/src/views/WithdrawView.vue`
- `h5-topup/src/views/OrdersView.vue`
- `h5-topup/src/views\OrderDetailView.vue`
- `h5-topup/src/stores/domain/recharge.js`
- `h5-topup/src/stores/domain/withdraw.js`
- `h5-topup/src/stores/domain/order.js`

### 6.2 后端

- `cool-admin-midway/src/modules/topup/service/recharge.ts`
- `cool-admin-midway/src/modules/topup/service/withdraw.ts`
- `cool-admin-midway/src/modules/topup/service/order.ts`
- `cool-admin-midway/src/modules/topup/service/commission.ts`
- `cool-admin-midway/src/modules/topup/service/transaction.ts`
- `cool-admin-midway/src/modules/user/service/wallet.ts`
- `cool-admin-midway/src/modules/user/service/transaction.ts`

处理这些文件时必须满足：

- 不静默修改金额、手续费、汇率、余额、冻结金额、状态机含义
- 不删除已有校验、确认步骤、失败提示、重复提交保护
- 不改变成功码、字段名、接口路径，除非前后端同步修改
- 涉及三方充值签名、回调、轮询时，先读完整调用链再改

## 7. 已知业务事实

### 7.1 `h5-topup` 当前页面路由

- 公开页：`/`、`/login`、`/register`、`/notice`、`/notice/:id`
- 登录后页面：`/orders`、`/orders/:orderNo`、`/profile`、`/agent`、`/recharge`、`/recharge/:type`、`/withdraw`、`/wallet`、`/records`

如果新增、删除、重命名路由，必须同步更新：

- `h5-topup/README.md`
- 如有必要，同步更新 `h5-topup/AGENTS.md`

### 7.2 `cool-admin-midway` 当前配置事实

- 本地开发环境数据库配置在 `src/config/config.local.ts`
- 本地 `synchronize: true`
- 生产 `synchronize: false`
- H5 前端默认通过 `http://127.0.0.1:8001` 访问后端

### 7.3 典型接口归属

- 用户登录/注册/信息：`user` 模块
- H5 充值、提现、订单、公告、分类、首页轮播图：`topup` 模块
- 开放配置：`app` 模块

不要因为名字相近，把 H5 业务错误挂到 `shop` 模块或其它演示模块。

## 8. 修改偏好

### 8.1 前端

- 优先延续 Composition API + `<script setup>` + JavaScript
- 避免为小功能引入新的全局状态
- 能复用已有组件就复用，如 `PageHeader`、`GlowCard`、`EmptyState`、`TabBar`
- 注意移动端 H5 细节：滚动区域、底部安全区、点击态、长文本溢出、按钮重复点击保护

### 8.2 后端

- Controller 尽量薄，复杂逻辑留在 Service
- 事务使用 `@CoolTransaction`
- 查询当前用户时优先复用 `ctx.user` 或 service 的用户获取能力
- 返回前注意是否应过滤密码、token、私密字段
- 改分页/列表接口时，优先确认 `pageQueryOp` / `listQueryOp` / 自定义 queryBuilder 是否与现有风格一致

## 9. 验证要求

### 9.1 前端改动后优先验证

在 `h5-topup` 目录下：

```bash
npm run lint
npm run build
```

至少检查：

- 登录/登出/未授权跳转
- 公开页与受保护页跳转
- 充值、提现、业务充值按钮是否有重复提交保护
- 列表页与详情页的 loading / empty / error 三态

### 9.2 后端改动后优先验证

在 `cool-admin-midway` 目录下：

```bash
npm run lint
npm run build
```

如改动影响业务链路，额外关注：

- `app` / `open` / `admin` 前缀是否正确
- 事务是否覆盖余额与状态更新
- 金额精度与状态流转是否正确
- H5 前端现有接口是否还能正常调用

## 10. 文档维护要求

以下情况应同步更新相关 README 或说明文档：

- `h5-topup` 路由、启动方式、代理规则、登录态机制发生变化
- `cool-admin-midway` 的端口、数据库初始化方式、关键模块位置发生变化
- 充值、提现、订单、公告、分类等核心接口契约发生变化
- 首页轮播图、首页关键资源来源、模块归属等基础事实发生变化

以下情况除 README 外，还应同步更新 `AGENTS.md`：

- 新增或调整“项目级事实”，会影响后续代理默认判断
- 新增或调整目录职责、模块归属、接口前缀边界
- 新增或调整高风险业务流程的修改约束
- 某个重要能力从“页面写死”改为“后端配置”或“资源化管理”

## 11. 最终目标

在这个仓库里，代理的首要目标不是产出“通用模板代码”，而是：

- 基于 `h5-topup` 与 `cool-admin-midway` 的现状工作
- 保持前后端接口契约稳定
- 降低资金相关流程的回归风险
- 保持文档、路由、配置和真实实现一致
