/** 本地存储统一封装，屏蔽端差异并兜底异常 */

export function get<T>(key: string, fallback: T): T {
  try {
    const value = uni.getStorageSync(key) as T
    if (value === '' || value === null || value === undefined) return fallback
    return value
  } catch {
    return fallback
  }
}

export function set(key: string, value: unknown): void {
  try {
    uni.setStorageSync(key, value)
  } catch {
    // 存储空间满等异常直接忽略，不影响主流程
  }
}

export function remove(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch {
    // ignore
  }
}

export function clearAll(): void {
  try {
    uni.clearStorageSync()
  } catch {
    // ignore
  }
}

/** 当前占用空间，用于设置页展示 */
export function info(): { keys: string[]; currentSize: number; limitSize: number } {
  try {
    const res = uni.getStorageInfoSync()
    return {
      keys: res.keys ?? [],
      currentSize: res.currentSize ?? 0,
      limitSize: res.limitSize ?? 0,
    }
  } catch {
    return { keys: [], currentSize: 0, limitSize: 0 }
  }
}
