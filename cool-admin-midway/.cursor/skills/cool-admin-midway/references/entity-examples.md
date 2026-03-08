# Entity 字段类型参考

## 常用字段类型

```ts
import { BaseEntity } from "../../base/entity/base";
import { Column, Entity, Index } from "typeorm";

@Entity("module_table")
export class ModuleTableEntity extends BaseEntity {
  // 字符串
  @Column({ comment: "名称", length: 100 })
  name: string;

  // 可空字符串
  @Column({ comment: "备注", nullable: true })
  remark: string;

  // 长文本
  @Column({ comment: "详情", type: "text", nullable: true })
  content: string;

  // 整数（tinyint 适合状态、类型等小范围枚举）
  @Column({ comment: "状态 0-禁用 1-启用", type: "tinyint", default: 1 })
  status: number;

  // 带可选项的字段（8.x新增，前端可自动识别）
  @Column({ comment: "状态", dict: ["禁用", "启用"], default: 1 })
  status2: number;

  // 带字典的字段（8.x新增）
  @Column({ comment: "类型", dict: "goodsType" })
  type: number;

  // 普通整数
  @Column({ comment: "排序", default: 0 })
  orderNum: number;

  // 金额/小数
  @Column({ comment: "价格", type: "decimal", precision: 10, scale: 2 })
  price: number;

  // JSON 数组
  @Column({ comment: "图片列表", type: "json", nullable: true })
  images: string[];

  // JSON 对象
  @Column({ comment: "扩展信息", type: "json", nullable: true })
  extra: Record<string, any>;

  // 日期（只精确到天）
  @Column({ comment: "生日", type: "date", nullable: true })
  birthday: Date;

  // 布尔
  @Column({ comment: "是否推荐", default: false })
  isRecommend: boolean;

  // 索引字段
  @Index()
  @Column({ comment: "用户ID" })
  userId: number;

  // 唯一索引
  @Index({ unique: true })
  @Column({ comment: "手机号", length: 11 })
  phone: string;

  // 虚拟字段（MySQL表达式，不存数据库）
  @Index()
  @Column({
    type: "varchar",
    length: 10,
    asExpression: "DATE_FORMAT(createTime, '%Y-%m-%d')",
    generatedType: "VIRTUAL",
    comment: "日期",
  })
  date: string;

  // JSON 内嵌对象提取为虚拟字段（方便索引和查询）
  @Index()
  @Column({
    asExpression: "JSON_EXTRACT(extra, '$.status')",
    generatedType: "VIRTUAL",
    comment: "额外状态",
    nullable: true,
  })
  extraStatus: number;
}
```

## 关联查询（不使用外键）

Cool Admin 推荐**不使用 TypeORM 外键关联**（OneToMany、ManyToOne 等），改用 `join` 配置或手动 SQL，原因：
- 避免外键性能损耗
- 便于分布式扩展
- 简化迁移

**正确做法**：在 `pageQueryOp.join` 中配置关联，或在 Service 中写 SQL。
