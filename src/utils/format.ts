/** 文本截断，超出加省略号 */
export function truncate(text: string, max = 40): string {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

/** 数字缩写：1234 -> 1.2k */
export function formatCount(value: number): string {
  if (value < 1000) return String(value)
  if (value < 10000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return `${(value / 10000).toFixed(1).replace(/\.0$/, '')}w`
}

/** 安全解析 JSON，失败返回兜底值 */
export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T
  } catch {
    return fallback
  }
}
