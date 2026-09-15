import { STORAGE_KEYS } from '@/constants'
import * as storage from '@/platform/storage'

/** 后端统一返回结构：{ code, message, data }，code 为 0 表示成功 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface RequestOptions {
  method?: HttpMethod
  data?: Record<string, unknown>
  header?: Record<string, string>
  /** 是否展示全屏 loading */
  loading?: boolean
  /** 是否携带 token */
  auth?: boolean
}

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const TIMEOUT = 15000

let unauthorizedHandler: (() => void) | null = null

/** 登录态失效时的统一处理（跳登录页 / 清状态） */
export function onUnauthorized(handler: () => void): void {
  unauthorizedHandler = handler
}

export function getToken(): string {
  return storage.get<string>(STORAGE_KEYS.token, '')
}

export function setToken(token: string): void {
  storage.set(STORAGE_KEYS.token, token)
}

export function clearToken(): void {
  storage.remove(STORAGE_KEYS.token)
}

function buildQuery(params: Record<string, unknown>): string {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

/** 统一请求入口：拼域名、带 token、拆业务码、兜底错误提示 */
export function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', data, header, loading = false, auth = true } = options
  const token = auth ? getToken() : ''

  if (loading) {
    uni.showLoading({ title: '加载中', mask: true })
  }

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      method,
      data,
      timeout: TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...header,
      },
      success: (res) => {
        const status = res.statusCode

        if (status === 401) {
          clearToken()
          unauthorizedHandler?.()
          reject(new Error('登录已过期，请重新登录'))
          return
        }

        if (status < 200 || status >= 300) {
          reject(new Error(`请求失败（${status}）`))
          return
        }

        const body = res.data as unknown as Record<string, unknown> | undefined

        if (body && typeof body === 'object' && typeof body.code === 'number' && body.code !== 0) {
          reject(new Error(String(body.message ?? '请求失败')))
          return
        }

        const payload =
          body && typeof body === 'object' && 'data' in body ? (body.data as T) : (res.data as T)
        resolve(payload)
      },
      fail: (error) => {
        reject(new Error(error.errMsg || '网络异常，请稍后重试'))
      },
      complete: () => {
        if (loading) uni.hideLoading()
      },
    })
  })
}

export function get<T>(
  url: string,
  params?: Record<string, unknown>,
  options: RequestOptions = {},
): Promise<T> {
  const query = params ? buildQuery(params) : ''
  return request<T>(query ? `${url}?${query}` : url, { ...options, method: 'GET' })
}

export function post<T>(
  url: string,
  data?: Record<string, unknown>,
  options: RequestOptions = {},
): Promise<T> {
  return request<T>(url, { ...options, method: 'POST', data })
}

export function put<T>(
  url: string,
  data?: Record<string, unknown>,
  options: RequestOptions = {},
): Promise<T> {
  return request<T>(url, { ...options, method: 'PUT', data })
}

export function del<T>(url: string, options: RequestOptions = {}): Promise<T> {
  return request<T>(url, { ...options, method: 'DELETE' })
}
