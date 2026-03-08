# 插件开发完整流程

## 插件结构

```
my-plugin/
├── src/
│   └── index.ts      # 入口，导出 Plugin
├── test/
│   └── index.ts      # 测试
├── assets/
│   └── logo.png      # 插件图标 256x256
├── plugin.json       # 插件配置（必须）
├── README.md         # 插件介绍
└── package.json
```

## plugin.json

```json
{
  "name": "插件名称",
  "key": "unique-key",
  "hook": "",
  "singleton": false,
  "version": "1.0.0",
  "description": "插件描述",
  "author": "作者",
  "logo": "assets/logo.png",
  "readme": "README.md",
  "config": {
    "appId": "默认值",
    "appSecret": "",
    "filePath": "@baseDir/data.json"
  }
}
```

**字段说明**：
- `key`：唯一标识，调用时使用
- `hook`：钩子，如 `upload` 可替换系统上传功能
- `singleton`：单例模式下插件只初始化一次，**无法获取请求 ctx**
- `@baseDir`：特殊关键字，表示项目根目录/src

## 插件主体

```ts
import { BasePlugin } from "@cool-midway/plugin-cli";

export class CoolPlugin extends BasePlugin {
  // 插件就绪钩子（单例只执行一次，非单例每次调用执行）
  async ready() {
    console.log("插件初始化完成", this.pluginInfo);
  }

  // 业务方法
  async doSomething(param: any) {
    // 获取插件配置
    const { appId, appSecret } = this.pluginInfo.config;
    // 使用缓存
    await this.cache.set("key", "value");
    return { result: "ok" };
  }

  // 调用其他插件（只在安装到 cool-admin 后才能调试）
  async useOtherPlugin() {
    const other = await this.pluginService.getInstance("other-key");
    return await other.someMethod();
  }
}

// 必须导出为 Plugin
export const Plugin = CoolPlugin;
```

## 多环境配置

```json
{
  "@local": {
    "appId": "dev-id",
    "appSecret": "dev-secret"
  },
  "@prod": {
    "appId": "prod-id",
    "appSecret": "prod-secret"
  }
}
```

## 在项目中调用插件

```ts
import { PluginService } from "../../../plugin/service/info";
import { Inject } from "@midwayjs/core";

@Inject()
pluginService: PluginService;

// 调用方法
const result = await this.pluginService.invoke("plugin-key", "methodName", arg1, arg2);

// 获取实例（自行调用方法）
const instance = await this.pluginService.getInstance("plugin-key");
const data = await instance["methodName"](arg1);

// 获取配置
const config = await this.pluginService.getConfig("plugin-key");
```

## 监听插件就绪事件

```ts
import { CoolEvent, Event } from "@cool-midway/core";
import { EVENT_PLUGIN_READY } from "../../plugin/service/center";

@CoolEvent()
export class PluginEvent {
  @Event(EVENT_PLUGIN_READY)
  async onPluginReady() {
    // 插件安装/更新后初始化操作
  }
}
```

## 打包发布

```bash
npm run release
# 生成 release/xxx.cool 插件包
```

发布到插件市场：https://cool-js.com/plugin/list.html
