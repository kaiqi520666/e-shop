# AGENTS.md

本文件定义本项目中 AI 编码代理的工作规则。目标是让代理在 `h5-topup` 目录内进行修改时，优先遵循项目现状、减少风格漂移，并避免对充值/提现等高风险流程造成回归。

## 执行清单（简版）

1. 先读相关代码，再改代码；不凭框架默认印象直接下手。
2. 只做和当前任务直接相关的最小改动，不顺手重构无关模块。
3. 保持现有技术栈和写法：Vue 3 + Composition API + `<script setup>` + JavaScript，不默认引入 TypeScript 式改造。
4. 遵守现有分层：页面放 `src/views/`，复用逻辑放 `src/composables/`，状态统一放 `src/stores/` 的分层目录中，接口统一放 `src/api/modules/**`，不在页面里写裸请求。
5. 保持项目现有 UI 风格：深色背景、荧光绿主色 `#00FFA3`、毛玻璃卡片、移动端优先，优先复用 `src/assets/main.css` 和已有组件。
6. 所有用户可见文案保持简体中文，所有文件保持 UTF-8；发现乱码先修复，禁止继续扩散乱码。
7. 涉及充值、提现、订单、金额、余额、汇率、钱包地址等高风险流程时，不允许静默改变业务行为，必须保留完整的成功、失败、校验、过期、不可用提示。
8. 路由有增删改，或权限、参数约定有变化时，必须同步更新 `README.md`。
9. 修改后优先自检：登录/登出、路由守卫、页面跳转、loading/empty/error、金额和状态文案是否正常。
10. 非 trivial 改动后执行 `npm run lint` 和 `npm run build`；如果因环境原因无法执行，要明确说明。

## 1. 项目定位

这是一个面向移动端的 H5 充值前端项目，主要覆盖以下业务：

- 首页业务入口
- 公告列表与详情
- 订单列表与详情
- 个人中心
- USDT 充值
- 业务充值
- 提现
- 钱包地址管理
- 消费记录
- 代理与邀请码

项目当前技术栈：

- Vue 3
- Vite 7
- Vue Router 5
- Pinia 3
- pinia-plugin-persistedstate
- Tailwind CSS 4
- Axios
- lucide-vue-next

当前代码以 JavaScript 为主，不要默认引入 TypeScript 风格改造，除非任务明确要求。

## 2. 目录与职责

核心目录约定如下：

- `src/views/`：页面级视图
- `src/components/`：可复用组件
- `src/stores/domain/`：业务域状态，如用户、订单、充值、提现、交易
- `src/stores/resource/`：资源型缓存状态，如配置、分类、公告
- `src/stores/ui/`：全局 UI 状态，如 toast、loading、confirm
- `src/stores/helpers/`：store 工厂和辅助逻辑
- `src/stores/index.js`：store 总出口
- `src/stores/reset.js`：全局状态重置协调
- `src/api/`：接口定义与请求封装
- `src/composables/`：可复用视图逻辑
- `src/utils/`：通用工具
- `src/router/`：路由定义与守卫
- `src/assets/main.css`：全局样式和语义化工具类

修改时应尽量遵守现有分层，不要把接口请求直接散落到页面里，也不要把页面细节塞进 store 或 utils。
新增 store 时不要再平铺到 `src/stores/` 根目录；默认从 `@/stores` 总出口导入，只有在需要底层实现细节时才直接从分层目录导入。

## 3. 必须遵守的项目规则

### 3.1 编码与文本

- 所有文件必须保持 UTF-8 编码。
- 禁止提交乱码、mojibake、混乱注释或损坏的中文文案。
- 如果修改到已经存在乱码的文件，应优先修复受影响文本，不要继续扩散乱码内容。
- 用户可见文案默认使用简体中文，除非任务明确要求其他语言。

### 3.2 路由与文档同步

- 路由定义位于 `src/router/index.js`。
- 只要新增、删除、重命名路由，或修改路由权限、参数、查询约定，就必须同步更新 `README.md`。
- 禁止出现“代码已改，README 仍是旧路由说明”的情况。

### 3.3 充值与提现属于高风险流程

以下内容视为高风险资金流程：

- `src/views/RechargeView.vue`
- `src/views/WithdrawView.vue`
- `src/views/BusinessRechargeView.vue`
- `src/stores/domain/recharge.js`
- `src/stores/domain/withdraw.js`
- `src/api/modules/topup/recharge.api.js`
- `src/api/modules/topup/withdraw.api.js`
- `src/api/modules/topup/order.api.js`
- 与金额、余额、汇率、钱包地址、订单状态相关的调用链

修改这些内容时：

- 不允许静默改变业务行为。
- 必须保持明确的成功、失败、校验、过期、不可用提示。
- 不要弱化金额、地址、汇率、确认步骤的校验。
- 完成后必须运行：
  - `npm run lint`
  - `npm run build`
- 如果因环境原因无法运行，必须明确说明。

## 4. 代码风格与实现偏好

### 4.1 Vue 组件

- 优先使用 Vue 3 Composition API 和 `<script setup>`。
- 保持当前项目的 JavaScript 单文件组件写法。
- 不要为了小改动引入过度抽象。
- 如果多个页面出现稳定重复，再抽离公共组件或 composable。

### 4.2 样式与 UI

保持当前项目的视觉语言一致：

- 深色背景
- 荧光绿主强调色 `#00FFA3`
- 毛玻璃/半透明卡片
- 边框色以 `#334155` 为主
- 移动端优先

样式实现要求：

- 优先复用 `src/assets/main.css` 中已有的语义类。
- 优先复用已有组件，如：
  - `PageHeader`
  - `SectionTitle`
  - `AppDivider`
  - `TabBar`
  - `GlowCard`
  - `EmptyState`
- 不要引入与现有风格冲突的桌面端布局或过重的视觉方案。
- 交互不要只依赖 `hover`，要考虑移动端点击与 `active` 状态。

### 4.3 API 与状态管理

- 所有 HTTP 请求统一通过 `src/api/index.js` 的 Axios 实例。
- 新接口优先增加到 `src/api/modules/**`，不要直接在页面里写裸请求。
- 保持现有响应约定：`code === 1000` 视为成功。
- 登录态、路由守卫、请求拦截器之间要保持一致。
- 不要无故复制同一份状态到多个 store。
- 对低频配置类数据，优先延续现有 `useCache` 模式。
- 页面、组件默认统一从 `@/stores` 导入 store；只有在需要使用底层实现或特定分层能力时，才直接从 `src/stores/domain|resource|ui/**` 导入。

## 5. 项目现状约束

代理在修改时应默认知道以下事实：

- 入口文件：`src/main.js`
- 根组件：`src/App.vue`
- 路由文件：`src/router/index.js`
- 当前使用的是 `createWebHistory`
- 当前开发代理将 `/api` 转发到 `http://127.0.0.1:8001`
- 当前项目通过 Pinia 持久化保存用户状态
- 当前项目存在全局能力挂载：
  - `window.$toast`
  - `window.$loading`
  - `window.$confirm`

如果任务涉及这些基础行为，修改时必须确保调用链闭环，不要只改一半。

## 6. 修改时的工作方式

- 先读相关文件，再改代码，不要凭框架默认印象直接写。
- 优先做小而明确的修改，避免无关重构。
- 若任务只改一个页面，不要顺手重写不相关模块。
- 如果发现实现与文档不一致，应指出并在本次任务内一起修正；至少不要继续扩大不一致。

## 7. 验证要求

### 非 trivial 改动后，优先执行

```bash
npm run lint
npm run build
```

### 至少需要重点关注的回归点

- 登录与登出是否正常
- 路由守卫是否仍然正确
- 页面跳转是否出现死链
- 列表页是否有 loading / empty / error 的基本处理
- 金额、汇率、余额、地址展示是否清晰
- 订单状态与页面文案是否一致

## 8. 文档维护要求

以下情况应同步更新 `README.md`：

- 新增或删除页面/路由
- 调整启动方式、代理方式、部署方式
- 修改登录态机制
- 修改核心目录结构或状态管理约定
- 修改充值/提现流程的重要交互或接口契约

## 9. 目标

代理在本项目中的首要目标不是“做一个通用的 Vue 项目”，而是：

- 贴合当前代码库
- 降低回归风险
- 保持视觉和交互一致性
- 让 README、路由、业务流程说明保持同步
- 尤其对充值、提现、订单等资金相关流程保持谨慎
