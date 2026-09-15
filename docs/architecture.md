# Life-Moments 代码架构

一套代码同时发布 **微信小程序** 与 **App**，技术栈为 uni-app + Vue 3 + TypeScript + Vite + Pinia。

## 1. 为什么是 uni-app

| 方案 | 适合 | 代价 |
| --- | --- | --- |
| **uni-app（本项目）** | 小程序 + App + H5 一套代码，国内生态成熟，插件市场全 | App 打包需要 HBuilderX（云端或离线） |
| Taro（React） | 团队熟 React，用 React Native 出 App | RN 端坑较多，App 侧基建要自己搭 |
| 原生小程序 + RN/Flutter | 追求极致体验 | 两套 UI，只共享逻辑层，成本最高 |

## 2. 分层

```
页面 / 组件 (pages, pagesSub, components, layouts)
        ↓ 只依赖 ↓
状态层 (stores)  ── 组合 ──►  接口层 (api)
        ↓                        ↓
        └──────►  平台适配层 (platform)  ◄──────┘
                        ↓
                   uni-app / 各端原生能力
```

- **页面、组件**：负责渲染与交互，不直接调用 `wx.*`、`plus.*`。
- **stores**：Pinia，按业务域拆分。跨页面共享的数据、登录态、列表分页都放这里。
- **api**：只描述后端接口，统一走 `api/request.ts`（拼域名、带 token、拆业务码、错误兜底）。
- **platform**：端能力适配层，所有条件编译 `#ifdef` 只出现在这一层。
- **utils / constants / types**：纯函数、常量、类型定义，不依赖以上任何一层。

## 3. 目录说明

| 目录 | 职责 |
| --- | --- |
| `src/pages` | 主包页面，只放首屏必需的页面 |
| `src/pagesSub` | 分包页面，详情、相册、设置等按需加载 |
| `src/components` | 跨端通用组件（纯 UI） |
| `src/layouts` | 页面骨架：标题区、内容区、底部操作区 |
| `src/platform` | 端差异适配：auth / share / media / storage / pay / push |
| `src/api` | 接口封装，`mock/` 内是本地演示数据 |
| `src/stores` | Pinia：app（平台/主题/网络）、user（登录态）、moment（记录列表） |
| `src/composables` | 组合式函数，例如 `usePagination` |
| `src/utils` | 纯函数：日期、格式化 |
| `src/types` | 业务模型：Moment、UserProfile、PageResult |
| `src/styles` + `src/uni.scss` | 全局样式变量与 mixin |
| `types/` | 全局 d.ts（环境变量等） |
| `tests/` | Vitest 单测，只覆盖纯逻辑层 |

## 4. 端差异处理

原则：**能统一的用 uni-app 统一 API，不能统一的收进 `platform/`**，业务代码永远调用同一个函数名。

| 能力 | 微信小程序 | App | 统一入口 |
| --- | --- | --- | --- |
| 登录 | `uni.login` 换 code | 手机号 / 一键登录 / Apple | `platform/auth.ts` |
| 分享 | 页面声明 `onShareAppMessage` | `uni.share` 唤起系统分享 | `platform/share.ts` |
| 选图 | `uni.chooseMedia` | `uni.chooseImage` | `platform/media.ts` |
| 支付 | `uni.requestPayment` | 需开通支付模块 | `platform/pay.ts` |
| 消息 | 订阅消息（一次性） | uniPush / 厂商通道 | `platform/push.ts` |
| 存储 | `uni.*StorageSync` | 同左 | `platform/storage.ts` |

## 5. 数据流

1. 页面 `onShow` / 下拉刷新 → `useMomentStore().refresh()`
2. store 调 `api/moment.ts` 的 `fetchMoments`
3. `api/request.ts` 拼上 `VITE_APP_API_BASE_URL` 与 token，发 `uni.request`
4. 业务码非 0 或 401 时统一抛错 / 清登录态，页面只管 `error` 展示

默认 `.env.development` 里 `VITE_APP_USE_MOCK=true`，页面用本地演示数据先跑通；后端就绪后改成 `false`，无需改页面代码。

## 6. 小程序体积约束

- 主包 ≤ 2MB，总包 ≤ 30MB（微信限制）。
- 新增页面先判断该不该进分包：详情、相册、设置、活动页一律进 `pagesSub`。
- `pages.json` 已配置 `preloadRule`，首页空闲时预载详情分包。
- 图片放 `src/static`，大图走 CDN/云存储，不要打进包里。

## 7. 后端接口约定

统一返回 `{ code, message, data }`，`code === 0` 为成功。当前规划：

| 接口 | 说明 |
| --- | --- |
| `POST /auth/login` | 端上凭证（微信 code / 手机号+验证码 / Apple token）换 token |
| `GET /user/profile` | 当前用户信息与统计 |
| `GET /moments` | 分页列表，支持 `page`、`pageSize`、`keyword` |
| `GET /moments/:id` | 详情 |
| `POST /moments` | 新建 |
| `PUT /moments/:id` | 编辑 |
| `DELETE /moments/:id` | 删除 |

## 8. 待接入清单

- [ ] `src/manifest.json` 里填写小程序 AppID 与 DCloud AppID
- [ ] 后端接口：登录、记录增删改查、图片上传
- [ ] 图片上传接入对象存储（`platform/media.ts` 的 `uploadFile`）
- [ ] ESLint + husky + commitlint（当前只上了 Prettier）
- [ ] GitHub Actions：`miniprogram-ci` 自动上传体验版、H5 自动部署
- [ ] App 打包：HBuilderX 云打包或离线打包
