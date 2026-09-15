/** 环境变量类型：与根目录 .env.* 文件一一对应 */
interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'production'
  readonly VITE_APP_API_BASE_URL: string
  readonly VITE_APP_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
