# H5 电商应用开发规范

## 项目技术栈

- **前端框架**: Vue 3 (Composition API + `<script setup>`)
- **构建工具**: Vite
- **状态管理**: Pinia (函数式 API + 持久化)
- **路由**: Vue Router
- **样式**: Tailwind CSS
- **HTTP 客户端**: Axios
- **图标**: lucide-vue-next
- **Mock 数据**: mockjs

## 项目结构

```
src/
├── api/           # API 封装和拦截器
├── assets/        # 静态资源
├── components/   # 公共组件
│   ├── common/    # Empty, Loading, Toast, RebateModal
│   └── layout/    # Header, BottomNav, PageWrapper
├── mock/         # Mock 数据
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
│   ├── user.js    # 用户状态 (登录、钱包、佣金)
│   ├── cart.js    # 购物车状态
│   ├── order.js   # 订单状态
│   ├── product.js # 商品状态
│   ├── address.js # 地址状态
│   └── review.js  # 评价状态
├── utils/        # 工具函数
└── views/        # 页面视图
```

## 代码风格

### Vue 组件
- 使用 `<script setup>` 语法糖
- 组件使用**命名导出** (`export const HomeView = defineComponent(...)`)
- 样式统一使用 **Tailwind CSS**
- 文件使用 `PascalCase` 命名

### Pinia Store
- 使用 Composition API 风格 + 持久化插件

### API 请求
- 统一使用 `src/api/index.js` 封装的 axios
- 响应成功码 `1000`，失败通过 `window.$toast?.error()` 提示

### 工具函数 (`src/utils/`)
- `generateInviteCode()` - 生成邀请码
- `formatPrice(price, currency)` - 格式化价格 (USDT/RMB)
- `maskPhone(phone)` / `maskAddress(address)` - 脱敏
- `generateOrderNo()` - 生成订单号
- `delay(ms)` - 模拟延迟

## 页面路由

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | HomeView | 首页 |
| `/category` | CategoryView | 分类页 |
| `/product/:id` | ProductView | 商品详情 |
| `/cart` | CartView | 购物车 |
| `/checkout` | CheckoutView | 结算页 |
| `/order-success` | OrderSuccessView | 订单成功 |
| `/orders` | OrderListView | 订单列表 |
| `/order/:id` | OrderDetailView | 订单详情 |
| `/profile` | ProfileView | 个人中心 |
| `/login` | LoginView | 登录 |
| `/register` | RegisterView | 注册 |
| `/recharge` | RechargeView | 充值 |
| `/transactions` | TransactionRecordView | 交易记录 |
| `/addresses` | AddressListView | 地址列表 |
| `/address/edit/:id?` | AddressFormView | 地址编辑 |
| `/agent` | AgentView | 代理中心 |

---

## 已有模块

完成并可用的业务模块：

1. ✅ 用户系统 - 登录、注册、充值、提现、钱包绑定
2. ✅ 商品浏览 - 首页推荐、分类筛选、商品详情
3. ✅ 购物车 - 添加/删除商品、数量修改
4. ✅ 订单系统 - 创建订单、订单列表、订单详情、订单状态
5. ✅ 地址管理 - 地址增删改查、默认地址
6. ✅ 评价系统 - 商品评价、评分
7. ✅ 代理中心 - 团队成员、佣金明细、返利

---

## 缺失模块

尚未实现的业务模块：

1. ⬜ 搜索功能 - 商品搜索、搜索历史、热门搜索
2. ⬜ 收藏/心愿单 - 添加收藏、收藏列表
3. ⬜ 消息通知 - 系统消息、订单通知、活动推送
4. ⬜ 优惠券 - 领取优惠券、券包、优惠码
5. ⬜ 物流追踪 - 物流信息、快递进度
6. ⬜ 客服/售后 - 在线客服、售后申请、退款
7. ⬜ 发票管理 - 开发票、发票历史
8. ⬜ 分享功能 - 商品分享、邀请好友
9. ⬜ 设置页面 - 通用设置、清除缓存、关于
10. ⬜ 会员体系 - 会员等级、积分商城

---

## 常用模式

### 添加新页面
1. 在 `src/views/` 创建 Vue 组件
2. 在 `src/router/index.js` 添加路由
3. 使用 `PageWrapper` 包裹页面内容

### 添加新 Store
参考 `src/stores/user.js` 的 Composition API 风格

### Mock 数据
- Mock 响应使用 `wrap(data)` 成功格式和 `wrapError(message)` 错误格式
- 静态数据放 `src/mock/data.js`，运行时数据（如购物车）直接在 `src/mock/index.js` 中用变量存储

---

## 更新规则

每完成一个业务模块后，请自动执行：
1. 将新模块添加到「已有模块」列表
2. 从「缺失模块」列表中移除
3. 输出更新后的完整 AGENTS.md 内容
