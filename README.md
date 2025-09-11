<p align="center">
  <img width="500" src="img/logo.jpg" alt="Yearning"/>
</p>

# Gemini（Yearning 前端）

![LICENSE](https://img.shields.io/badge/license-AGPL%20-blue.svg)
![build](https://img.shields.io/badge/build-release-brightgreen.svg)
![version](https://img.shields.io/badge/version-v2.x-brightgreen.svg)
![webpack](https://img.shields.io/badge/webpack-v4-brightgreen.svg)

Yearning SQL 审核平台的前端代码。

## 最近更新（i18n 与清理）

- 新增多国语言：简体中文、English、日本語。
- 顶部新增语言切换组件：
  - 登录页右上角、登录后主框架右上角均可切换。
  - 语言选择持久化到 `localStorage.lang`，下次进入自动使用。
- 大范围移除中文硬编码，覆盖模块：
  - 登录、首页仪表盘、查询流程/SQL、工单提交/确认、权限弹窗、审核（工单/查询）、执行与记录（工单/查询）、管理（用户/数据库/流程模板/规则/自动任务）等。
- 统一下拉无数据与表格无数据文案：
  - Select：`No matching data` → i18n（无匹配数据/No matching data/一致するデータがありません）。
  - Table：`No data` → i18n（暂无数据/No data/データがありません）。
- 清理赞助相关：移除赞助入口与弹窗，保留与使用无关的声明文本。

## 开发环境

- Node.js：建议 16 LTS（或 14/17）。
  - 已提供 `.nvmrc` / `.node-version` 与 `package.json.engines`/`volta`，便于快速切换到 Node 16。
- 安装依赖（建议忽略 peer 依赖冲突）：

```bash
npm install --legacy-peer-deps
```

- 本地启动：

```bash
npm run serve
```

浏览器访问 `http://localhost:8080`。无后端联调时，可在控制台写入：

```js
sessionStorage.setItem('user','demo')
sessionStorage.setItem('access','3')
```

然后直接访问各功能页（例如查询流程：`#/query/order`）。

## 目录与 i18n 说明

- 语言文件：`src/language/`
  - `zh-cn.json`、`en-us.json`、`ja-jp.json`
  - 入口：`src/language/index.ts`（含语言持久化与 View-Design UI 语言联动）
- 语言切换组件：`src/components/LanguageSwitcher.vue`
- 路由标题统一使用 i18n key：`nav.*`（见各语言文件）
- 组件内避免在 data 中保存 `$t('...')` 的静态结果；统一使用 computed getter 随语言切换即时更新。

### 新增语言/文案的方式

1. 在 `src/language/xx-xx.json` 中新增键值。
2. 组件内通过 `$t('your.key')` 使用；在校验/消息中请直接依赖 `$t` 或在 computed/getter 中生成，避免初始化后不会更新的问题。

## 截图

![](img/login.png)

![](img/dash.png)

## 许可证

- AGPL v3

任何二次开发及开源项目请严格遵守相应开源许可。

© 2019–2025 Yearning Authors
