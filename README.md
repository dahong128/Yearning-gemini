<p align="center">
  <img width="500" src="img/logo.jpg" alt="Yearning"/>
</p>

# Gemini（Yearning 前端）

![LICENSE](https://img.shields.io/badge/license-AGPL%20-blue.svg)
![build](https://img.shields.io/badge/build-release-brightgreen.svg)
![version](https://img.shields.io/badge/version-v2.4.1-brightgreen.svg)
![webpack](https://img.shields.io/badge/webpack-v4-brightgreen.svg)

Yearning SQL 审核平台的前端代码。

## 最近更新（i18n 与清理）

- 新增多国语言：简体中文、English、日本語。
- 顶部新增语言切换组件：
  - 登录页右上角、登录后主框架右上角均可切换。
  - 语言选择持久化到 `localStorage.lang`，下次进入自动使用。
- 大范围移除中文硬编码，覆盖模块：
  - 登录、首页仪表盘、查询流程/SQL、工单提交/确认、权限弹窗、审核（工单/查询）、执行与记录（工单/查询）、管理（用户/数据库/流程模板/规则/自动任务）等。
- 2.4.1：继续完善管理与审核页的多语言覆盖（设置、用户、数据库、权限组、审核规则、自动任务、审核弹窗等），并将常见后端中文提示映射为 i18n，保证 Notice/Message 本地化显示。
- 统一下拉无数据与表格无数据文案：
  - Select：`No matching data` → i18n（无匹配数据/No matching data/一致するデータがありません）。
  - Table：`No data` → i18n（暂无数据/No data/データがありません）。
- 清理赞助相关：移除赞助入口与弹窗，保留与使用无关的声明文本。

## 快速开始

- 推荐 Node.js 16.x（见 `package.json.engines` 与 `volta` 固定版本）。
- 安装依赖（老版本 vue-cli 生态，建议忽略 peer 依赖冲突）：

```bash
npm install --legacy-peer-deps
```

- 启动开发服务器：

```bash
npm run serve
```

开发地址默认 `http://localhost:8080`。

无后端联调时可临时跳过登录（仅用于本地开发排查）：

```js
sessionStorage.setItem('user','demo')
sessionStorage.setItem('access','3') // 1/2/3 分别对应不同访问级别
```

随后可直接访问功能页（如 SQL 查询流程：`#/query/order`）。

## 功能概览

- 用户认证：用户名/密码与可选 LDAP 登录；JWT 存储于 `sessionStorage.jwt`。
- 首页仪表盘：统计卡片、近 6 周/天趋势、数据源占比等。
- SQL 查询：多数据源、流程化提交与进度查看。
- 工单提交：SQL 变更工单创建、确认与执行。
- 审核中心：查询/工单审核、拒绝/通过、流程节点流转。
- 执行与记录：查询与工单的执行记录、详情回溯。
- 系统管理：用户、数据库、角色组、流程模板、审核规则、自动任务、系统设置。
- 多语言：简体中文、English、日本語，随时切换并持久化。

## 技术栈

- Vue 2.6 + TypeScript（`vue-property-decorator` / `vuex-module-decorators`）
- 路由与状态：`vue-router@3`、`vuex@3`
- UI 组件：`view-design@4`（iView）
- 国际化：`vue-i18n@8`
- 网络请求：`axios`（拦截器统一注入消息、401 触发二次登录）
- 可视化：`@antv/g2`
- 其他：`mavon-editor`、`particles.js`

## 运行与构建

- 开发：`npm run serve`
- 构建：`npm run build`（产物位于 `dist/`）
- 代码规范：`npm run lint`

重要构建选项（见 `vue.config.js`）：

- `publicPath: '/front'`：应用发布路径为 `/front`（影响生产环境资源引用）。
- `assetsDir: './assets'`：静态资源目录。
- `devServer.proxy: 'http://localhost:8000'`：开发环境将前端请求代理至后端。

## 配置与部署

- 后端 API 前缀：在 `src/libs/libs.ts` 中的 `libs.url = '/api/v2'`，建议生产通过反向代理转发，无需改代码。
- 生产发布路径：若不是部署在 `/front`，需调整 `vue.config.js` 的 `publicPath` 并重新构建。
- 开发代理：如后端地址变化，修改 `vue.config.js` 的 `devServer.proxy`。

Nginx 参考配置（示例）：

```nginx
server {
  listen 80;
  server_name your.domain.com;

  # 前端静态资源
  location /front {
    root /path/to/dist;      # dist 所在目录
    try_files $uri $uri/ /front/index.html;
  }

  # 转发 API 至后端 Yearning 服务
  location /api/v2 {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

## 项目结构

- `src/apis/`：按领域划分的 API 封装（基于 `axios` + 拦截器）
- `src/components/`：通用组件（含 `LanguageSwitcher.vue`、表单、表格、弹窗等）
- `src/language/`：多语言 JSON 词条与入口 `index.ts`
- `src/libs/`：全局工具与请求封装（含 `libs.url`、消息通知等）
- `src/views/`：页面视图（登录、首页、查询、审核、记录、管理等）
- `src/store/`：`vuex` 状态
- `src/styles/`：全局样式与主题
- `src/router.ts`：路由配置（以 `meta.title` 配合 i18n）
- `src/main.ts`：入口文件（挂载路由、状态与 i18n）

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
