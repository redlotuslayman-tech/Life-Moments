# Life-Moments

记录生命中的美好时刻。**一套代码同时发布微信小程序与 App**。

## 技术栈

- uni-app + Vue 3 + TypeScript + Vite
- Pinia（状态管理）、SCSS（样式变量统一在 `src/uni.scss`）
- Vitest（纯逻辑单测）、Prettier（格式化）

## 快速开始

```bash
pnpm install

# 微信小程序：产物在 dist/dev/mp-weixin，用微信开发者工具打开这个目录
pnpm dev:mp-weixin

# H5 预览（调试页面最快的方式）
pnpm dev:h5

# App：先构建，再用 HBuilderX 运行 / 云打包
pnpm build:app
```

其他命令：

```bash
pnpm build:mp-weixin   # 小程序生产构建
pnpm type-check        # TypeScript 类型检查
pnpm test              # 单元测试
pnpm format            # Prettier 格式化
```

## 目录结构

```
src/
├─ pages/          主包页面：时间轴、记录、我的
├─ pagesSub/       分包页面：记录详情、设置
├─ components/     跨端通用组件
├─ layouts/        页面骨架
├─ platform/       端差异适配层（登录、分享、选图、支付、推送、存储）
├─ api/            接口封装 + mock 数据
├─ stores/         Pinia：app / user / moment
├─ composables/    组合式函数（usePagination 等）
├─ utils/          纯函数（日期、格式化）
├─ types/          业务模型
├─ styles/         全局样式与 mixin
├─ static/         包内静态资源
├─ App.vue main.ts pages.json manifest.json uni.scss
```

架构细节见 [docs/architecture.md](docs/architecture.md)。

## 两条必须遵守的约定

1. **业务代码不写 `wx.*` / `plus.*`**，需要端能力就从 `@/platform/...` 取，条件编译只写在 `platform/` 里。
2. **主包只放首屏页面**，新的详情、活动、设置类页面一律进 `src/pagesSub`，避免主包超过 2MB。

## 开始接入后端

`.env.development` 默认 `VITE_APP_USE_MOCK=true`，页面跑的是 `src/api/mock` 里的演示数据。
把接口域名填进 `.env.production`、把 `VITE_APP_USE_MOCK` 改成 `false`，页面代码不需要改动。
