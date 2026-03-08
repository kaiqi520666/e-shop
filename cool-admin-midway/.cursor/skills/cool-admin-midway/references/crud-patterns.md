# CRUD 完整模式参考

## 标准模块结构

```
src/modules/goods/
├── controller/
│   ├── admin/
│   │   ├── info.ts       # 后台商品接口
│   │   └── category.ts   # 后台分类接口
│   └── app/
│       └── info.ts       # 前台商品接口
├── entity/
│   ├── info.ts
│   └── category.ts
├── service/
│   └── info.ts
└── config.ts
```

## 完整 Controller 示例

```ts
import { CoolController, BaseController } from "@cool-midway/core";
import { Body, Get, Inject, Post, Query } from "@midwayjs/core";
import { GoodsInfoEntity } from "../../entity/info";
import { GoodsCategoryEntity } from "../../entity/category";
import { GoodsInfoService } from "../../service/info";

@CoolController({
  api: ["add", "delete", "update", "info", "list", "page"],
  entity: GoodsInfoEntity,
  service: GoodsInfoService,
  insertParam: (ctx) => ({ userId: ctx.admin?.userId }),
  infoIgnoreProperty: [],
  pageQueryOp: {
    keyWordLikeFields: ["a.name"],
    fieldEq: [
      "a.status",
      "a.categoryId",
      // 请求参数名与字段名不同时
      { column: "a.type", requestParam: "goodsType" },
    ],
    fieldLike: ["a.name"],
    select: [
      "a.*",
      "b.name as categoryName",
    ],
    join: [
      {
        entity: GoodsCategoryEntity,
        alias: "b",
        condition: "a.categoryId = b.id",
        type: "leftJoin",
      },
    ],
    addOrderBy: { "a.orderNum": "DESC", "a.createTime": "DESC" },
    where: async (ctx) => {
      const { minPrice, maxPrice } = ctx.request.body;
      return [
        ["a.status = :s", { s: 1 }],
        ["a.price >= :min", { min: minPrice }, minPrice],
        ["a.price <= :max", { max: maxPrice }, maxPrice],
      ];
    },
  },
})
export class AdminGoodsInfoController extends BaseController {
  @Inject()
  goodsInfoService: GoodsInfoService;

  // 自定义接口
  @Post("/updateStatus")
  async updateStatus(@Body("id") id: number, @Body("status") status: number) {
    await this.goodsInfoService.updateStatus(id, status);
    return this.ok();
  }

  // 覆盖默认 info（返回更多关联数据）
  @Get("/info")
  async info(@Query("id") id: number) {
    return this.ok(await this.goodsInfoService.detail(id));
  }
}
```

## 完整 Service 示例

```ts
import { Provide, Inject } from "@midwayjs/core";
import { BaseService, CoolCommException } from "@cool-midway/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { GoodsInfoEntity } from "../entity/info";

@Provide()
export class GoodsInfoService extends BaseService {
  @InjectEntityModel(GoodsInfoEntity)
  goodsInfoEntity: Repository<GoodsInfoEntity>;

  @Inject()
  ctx;

  async add(param: any) {
    // 前置处理
    const result = await super.add(param);
    // 后置处理
    return result;
  }

  async modifyBefore(data: any, type: "add" | "update" | "delete") {
    // 修改前校验/处理
  }

  async modifyAfter(data: any, type: "add" | "update" | "delete") {
    // 修改后触发事件/更新缓存等
  }

  async detail(id: number) {
    const info = await this.goodsInfoEntity.findOneBy({ id });
    if (!info) throw new CoolCommException("数据不存在");
    // 关联查询
    const extra = await this.nativeQuery(
      `SELECT * FROM goods_sku WHERE goodsId = ?`,
      [id]
    );
    return { ...info, skus: extra };
  }

  async updateStatus(id: number, status: number) {
    await this.goodsInfoEntity.update(id, { status });
  }

  // 动态条件分页
  async customPage(query: any) {
    return this.sqlRenderPage(
      `SELECT a.*, b.name as categoryName
       FROM goods_info a
       LEFT JOIN goods_category b ON a.categoryId = b.id
       WHERE 1=1
       ${this.setSql(query.status !== undefined, "AND a.status = ?", [query.status])}
       ${this.setSql(query.keyword, "AND a.name LIKE ?", [`%${query.keyword}%`])}
       ORDER BY a.createTime DESC`,
      query
    );
  }
}
```

## App 端接口（对外，状态过滤）

```ts
@CoolController({
  api: ["info", "page", "list"],
  entity: GoodsInfoEntity,
  pageQueryOp: {
    keyWordLikeFields: ["a.name"],
    fieldEq: ["a.categoryId"],
    where: async () => [["a.status = :s", { s: 1 }]], // 只返回上架
    addOrderBy: { "a.sales": "DESC" },
  },
})
export class AppGoodsInfoController extends BaseController {}
```

## page 接口请求参数

```json
{
  "keyWord": "搜索关键词",
  "status": 1,
  "categoryId": 3,
  "page": 1,
  "size": 20,
  "order": "createTime",
  "sort": "desc"
}
```

## page 接口返回格式

```json
{
  "code": 1000,
  "message": "success",
  "data": {
    "list": [...],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 100
    }
  }
}
```
