import path from 'node:path'
import { defineConfig } from 'vitest/config'

// 单元测试只覆盖纯逻辑层（utils / stores / platform），UI 走真机与开发者工具验证
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
  },
})
