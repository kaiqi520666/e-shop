---
name: cool-admin-midway
description: Expert skill for developing with the cool-admin-midway (Node.js) framework. Use this skill whenever the user is working on a cool-admin project, asks about cool-admin APIs, wants to create modules/controllers/services/entities, set up CRUD, configure plugins, deploy, or troubleshoot any cool-admin-related code. Trigger on mentions of cool-admin, CoolController, BaseService, CoolController, midway backend, cool-admin module, @cool-midway, eps, CoolCache, CoolTransaction, CoolEvent, CoolQueue, or any request to scaffold backend code in this framework.
---

# Cool Admin Midway Skill

Cool Admin (Node版) 是基于 **Midwayjs + TypeORM** 的后台管理框架，当前最新版本为 **v8.0**。

> 遇到模块开发、CRUD、插件、部署、权限、任务队列、Socket、微服务等需求时，**始终参考本文档**，不要凭记忆猜测 API。

---

## 技术栈

| 层次 | 技术 |
|------|------|
| 基础框架 | [Midwayjs](https://www.midwayjs.org/) |
| ORM | TypeORM（支持 MySQL / PostgreSQL / SQLite） |
| 缓存 | 内置 CoolCacheStore 或 Redis（`cache-manager-ioredis-yet`） |
| 任务队列 | BullMQ（需 Redis） |
| 即时通讯 | Socket.io v4 |
| 微服务 | Moleculer |
| 大数据 | Elasticsearch 8.x |

---

## 项目结构

```
src/
├── modules/            # 业务模块
│   └── {module}/
│       ├── controller/
│       │   ├── admin/  # 后台接口（需 JWT）
│       │   ├── app/    # 对外接口（需 JWT）
│       │   └── open/   # 公开接口（无需 JWT）
│       ├── entity/     # TypeORM 实体
│       ├── service/    # 业务逻辑
│       ├── dto/        # 参数校验
│       ├── middleware/
│       ├── queue/      # 队列
│       ├── event/      # 事件
│       └── config.ts   # 模块配置（必须）
├── config/
│   ├── config.default.ts
│   ├── config.local.ts  # npm run dev
│   └── config.prod.ts   # npm run start
└── configuration.ts
```

---

## 核心概念

### 路由自动生成规则

路由由**文件路径**自动生成，无需手动指定：

```
src/modules/{module}/controller/{prefix}/{file}.ts
→ /{prefix}/{module}/{file}/{method}
```

例：`src/modules/demo/controller/admin/goods.ts` → `/admin/demo/goods/page`

- `admin/` 前缀：需要后台 JWT
- `app/` 前缀：需要用户 JWT
- `open/` 前缀：公开，无需 JWT

---

## Entity 定义

```ts
// v8.x 之后 BaseEntity 位于项目内，不再从包导入
import { BaseEntity } from "../../base/entity/base";
import { Column, Entity, Index } from "typeorm";

@Entity("demo_goods")  // 表名格式：模块名_表名
export class DemoGoodsEntity extends BaseEntity {
  @Index()
  @Column({ comment: "标题", length: 100 })
  title: string;

  @Column({ comment: "价格", type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ comment: "状态 0-下架 1-上架", type: "tinyint", default: 1 })
  status: number;

  @Column({ comment: "图片列表", type: "json", nullable: true })
  images: string[];

  // 8.x 新增：字段配置字典（前端自动识别）
  @Column({ comment: "分类", dict: "goodsType" })
  type: number;
}
```

**BaseEntity 内置字段**：`id`（自增）、`createTime`、`updateTime`、`tenantId`

**虚拟字段示例**（不存数据库，由表达式计算）：
```ts
@Column({
  type: "varchar", length: 7,
  asExpression: "DATE_FORMAT(createTime, '%Y-%m')",
  generatedType: "VIRTUAL",
  comment: "月份",
})
month: string;
```

---

## Controller（控制器）

### 快速 CRUD

```ts
import { CoolController, BaseController } from "@cool-midway/core";
import { DemoGoodsEntity } from "../../entity/goods";
import { DemoGoodsService } from "../../service/goods";

@CoolController({
  api: ["add", "delete", "update", "info", "list", "page"],
  entity: DemoGoodsEntity,
  service: DemoGoodsService, // 可选，自定义 service 实现
  // 向新增数据插入当前登录用户ID
  insertParam: (ctx) => ({ userId: ctx.admin?.userId }),
  // info 接口过滤字段
  infoIgnoreProperty: ["password"],
  // 分页查询配置
  pageQueryOp: {
    keyWordLikeFields: ["a.title"],        // keyWord 模糊搜索字段
    fieldEq: ["a.status", "a.type"],       // 精确筛选字段
    fieldLike: ["a.title"],                // 单独模糊查询字段
    select: ["a.*", "b.name as catName"],  // 多表必须指定 select
    join: [
      {
        entity: OtherEntity,
        alias: "b",
        condition: "a.categoryId = b.id",
        type: "leftJoin",  // 或 "innerJoin"
      },
    ],
    addOrderBy: { "a.createTime": "DESC" },
    where: async (ctx) => [
      ["a.status = :s", { s: 1 }],
      // 条件满足才加
      ["a.type = :t", { t: ctx.request.body.type }, ctx.request.body.type],
    ],
  },
})
export class AdminDemoGoodsController extends BaseController {}
```

**生成的接口**：
- `POST /add` 新增
- `POST /delete` 删除（body: `{ ids: [1,2] }`）
- `POST /update` 更新
- `GET /info?id=1` 单条详情
- `POST /list` 列表
- `POST /page` 分页（支持 `keyWord`, `page`, `size`, `sort`, `order`）

### serviceApis（将 Service 方法注册为接口）

```ts
@CoolController({
  api: ["add", "page"],
  entity: DemoGoodsEntity,
  service: DemoGoodsService,
  serviceApis: [
    "myMethod",
    { method: "anotherMethod", summary: "接口描述" },
  ],
})
```

调用方式：`POST /{prefix}/{module}/{file}/myMethod`，参数通过 body 传递。

### 路由标签（忽略 Token）

```ts
import { CoolUrlTag, TagTypes, CoolTag } from "@cool-midway/core";

@CoolUrlTag({ key: TagTypes.IGNORE_TOKEN, value: ["notify"] })
@CoolController()
export class AppOrderController extends BaseController {
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post("/notify")
  async notify() { ... }
}
```

---

## Service（服务层）

```ts
import { Provide, Inject } from "@midwayjs/core";
import { BaseService } from "@cool-midway/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { DemoGoodsEntity } from "../entity/goods";

@Provide()
export class DemoGoodsService extends BaseService {
  @InjectEntityModel(DemoGoodsEntity)
  demoGoodsEntity: Repository<DemoGoodsEntity>;

  @Inject()
  ctx; // 获取请求上下文

  // 重写内置方法
  async add(param: any) {
    const result = await super.add(param);
    // 自定义逻辑
    return result;
  }

  // 修改前钩子
  async modifyBefore(data: any, type: "add" | "update" | "delete") {
    if (type === "update") data.password = md5(data.password);
  }

  // 修改后钩子
  async modifyAfter(data: any, type: "add" | "update" | "delete") {
    // 放入队列、更新ES等
  }

  // 原生 SQL
  async customQuery(id: number) {
    return this.nativeQuery(
      `SELECT a.*, b.name FROM demo_goods a LEFT JOIN category b ON a.categoryId = b.id
       WHERE 1=1 ${this.setSql(id, "AND a.id = ?", [id])}`,
    );
  }

  // 分页 SQL
  async pageQuery(query: any) {
    return this.sqlRenderPage(
      "SELECT * FROM demo_goods ORDER BY id DESC",
      query,
    );
  }

  // TypeORM QueryBuilder 分页
  async entityPage(query: any) {
    const find = this.demoGoodsEntity.createQueryBuilder("a");
    find.where("a.status = :s", { s: 1 });
    return this.entityRenderPage(find, query);
  }
}
```

---

## 事务

```ts
import { CoolTransaction } from "@cool-midway/core";
import { QueryRunner } from "typeorm";

@CoolTransaction()
async doSomething(params: any, queryRunner?: QueryRunner) {
  // 必须用 queryRunner 操作数据库，不能是异步链式调用
  await queryRunner.manager.insert(DemoGoodsEntity, { title: "test" });
  // 抛出异常会自动回滚
}
```

---

## 模块配置（必须）

```ts
// src/modules/{module}/config.ts
import { ModuleConfig } from "@cool-midway/core";

export default () => ({
  name: "模块名称",
  description: "模块描述",
  middlewares: [],       // 仅本模块中间件
  globalMiddlewares: [], // 全局中间件
  order: 0,              // 加载顺序，值越大越先加载
} as ModuleConfig);
```

---

## 缓存

v7.1+ 使用 Midway 官方 CacheManager：

```ts
import { InjectClient } from "@midwayjs/core";
import { CachingFactory, MidwayCache } from "@midwayjs/cache-manager";

@InjectClient(CachingFactory, "default")
midwayCache: MidwayCache;

await this.midwayCache.set("key", value, 10 * 1000); // TTL 10秒
await this.midwayCache.get("key");
```

**方法级缓存**：
```ts
import { CoolCache } from "@cool-midway/core";

@CoolCache(5000) // 缓存5秒
async getHotList() {
  return this.nativeQuery("SELECT ...");
}
```

切换 Redis 缓存：`pnpm i cache-manager-ioredis-yet`，然后在 `config.default.ts` 配置 `cacheManager.clients.default.store = redisStore`。

---

## 任务与队列

### 定时任务（本地，v8.0 无需 Redis）

后台管理 → 系统管理 → 任务管理 → 新建任务，填写：
- Service：`demoTaskService`（类名首字母小写）
- 方法：`test`
- Cron：`*/5 * * * * *`（每5秒）

```ts
@Provide()
export class DemoTaskService extends BaseService {
  async test(params?: any[]) {
    console.log("任务执行", params);
  }
}
```

### 队列（需 Redis）

```ts
import { CoolQueue, BaseCoolQueue } from "@cool-midway/task";

@CoolQueue()
export class DemoCommQueue extends BaseCoolQueue {
  async data(job: any, done: any) {
    console.log("消费数据", job.data);
    done();
  }
}

// 发送数据
this.demoCommQueue.add({ userId: 1 });
// 延迟5秒
this.demoCommQueue.add({ userId: 1 }, { delay: 5000 });
```

---

## 事件

```ts
// 监听
import { CoolEvent, Event } from "@cool-midway/core";

@CoolEvent()
export class DemoEvent {
  @Event("userCreated")
  async onUserCreated(data: any) { ... }
}

// 发送
import { CoolEventManager } from "@cool-midway/core";

@Inject()
coolEventManager: CoolEventManager;

this.coolEventManager.emit("userCreated", { id: 1 });

// 多进程广播
await this.coolEventManager.globalEmit("userCreated", false, { id: 1 });
```

---

## 权限系统

- `/admin/**`：需要后台 JWT，权限在 `base` 模块 `middleware/authority.ts` 校验
- `/app/**`：需要用户 JWT，权限在 `user` 模块 `middleware/app.ts` 校验
- `/open/**` 或 `comm/`：无需 JWT

Token 获取：`ctx.admin.userId`、`ctx.admin.roleIds`、`ctx.admin.username`

---

## 多租户（v8.0）

```ts
// config.default.ts
cool: {
  tenant: {
    enable: true,
    urls: ["/admin/**/*"], // 需要租户过滤的路由
  },
}
```

开启后框架自动从 JWT 中提取 `tenantId` 注入查询条件，无需改代码。

局部关闭租户过滤：
```ts
import { noTenant } from "../../base/db/tenant";
await noTenant(this.ctx, async () => {
  return await this.entity.find();
});
```

---

## 国际化（v8.0）

```ts
// config.default.ts
cool: {
  i18n: {
    enable: true,
    languages: ["zh-cn", "zh-tw", "en"],
  },
}
```

框架自动扫描菜单、字典、`CoolCommException` 消息并调用大模型翻译，生成 `src/locales/` 目录。**无需改代码**，重启生效。

---

## 数据库配置

```ts
// config.local.ts（开发）
typeorm: {
  dataSource: {
    default: {
      type: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "123456",
      database: "cool",
      synchronize: true,  // ⚠️ 生产环境关闭！
      logging: false,
      charset: "utf8mb4",
      entities: ["**/modules/*/entity"],
    },
  },
},
```

支持 `mysql` / `postgres` / `sqlite`，切换只需改 `type` 及对应驱动。

---

## 插件系统

```ts
// 调用插件
import { PluginService } from "../../../plugin/service/info";

@Inject()
pluginService: PluginService;

// invoke(插件key, 方法名, ...参数)
const result = await this.pluginService.invoke("aliyun-oss", "upload", file);

// 获取插件实例
const instance = await this.pluginService.getInstance("ollama");

// 获取插件配置
const config = await this.pluginService.getConfig("wechat-pay");
```

插件在后台管理 → 扩展管理 → 插件管理 中安装/卸载/配置。

---

## 部署

### 普通部署（PM2）

```bash
# 打包
npm run build

# PM2 cluster 启动
pm2 start ./bootstrap.js -i max --name cool-admin
```

### Nginx 关键配置

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:8001/;
  # SSE 必须
  proxy_buffering off;
  proxy_cache off;
  proxy_http_version 1.1;
  proxy_set_header Connection '';
}

location /socket {
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}
```

### 原生打包（v8.0，无需 Node 环境）

```bash
npm run pkg
# 生成 build/cool-admin-{platform} 可执行文件
```

targets 示例：`node20-linux-x64`、`node20-win-x64`、`node20-macos-arm64`

---

## 常见错误

| 错误 | 原因 | 解决 |
|------|------|------|
| 多表查询报重复字段 | 未指定 `select` | `pageQueryOp` 加 `select: ["a.*", ...]` |
| `未设置操作实体` | Service 间调用 BaseService 方法 | 在目标 Service `@Init` 中调用 `this.setEntity(...)` |
| 生产环境 API 404 | `eps.json` 未生成 | 本地先启动一次，提交 `eps.json` |
| 任务不执行 | 直接改数据库状态 | 必须通过后台 UI 或代码操作，Redis 中状态未同步 |
| 模块不加载 | `config.ts` 缺失 | 每个模块必须有 `config.ts` |
| 多租户不生效 | 使用 `nativeQuery` | 原生 SQL 不自动注入，需手动加 `tenantId` 条件 |

---

## 快速代码模板

详细示例见 `references/` 目录：
- `references/entity-examples.md` — 常见字段类型示例
- `references/crud-patterns.md` — 完整 CRUD 模式（含关联查询）
- `references/plugin-dev.md` — 插件开发完整流程
