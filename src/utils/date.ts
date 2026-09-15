const DATE_PATTERN = /YYYY|MM|DD|HH|mm|ss/g

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value)
}

/** 把 Date / 时间戳 / 字符串统一转成 Date，非法输入返回 null */
export function toDate(input: Date | string | number): Date | null {
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input
  }
  if (typeof input === 'number') {
    const fromNumber = new Date(input)
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber
  }
  // iOS / Safari 不认 "2026-09-15 10:00" 这种格式，先换成斜杠
  const normalized = input.includes('T') ? input : input.replace(/-/g, '/')
  const fromString = new Date(normalized)
  return Number.isNaN(fromString.getTime()) ? null : fromString
}

/** 格式化时间，默认 2026-09-15 10:30 */
export function formatDate(input: Date | string | number, pattern = 'YYYY-MM-DD HH:mm'): string {
  const date = toDate(input)
  if (!date) return ''

  const map: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  }

  return pattern.replace(DATE_PATTERN, (key) => map[key] ?? key)
}

/** 是否同一天 */
export function isSameDay(a: Date | string | number, b: Date | string | number): boolean {
  const dateA = toDate(a)
  const dateB = toDate(b)
  if (!dateA || !dateB) return false

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

/**
 * 相对时间：刚刚 / 12 分钟前 / 3 小时前 / 昨天 / 5 天前 / 具体日期。
 * 「昨天」按自然日判断，而不是按 24 小时算。
 */
export function fromNow(input: Date | string | number, now: Date = new Date()): string {
  const date = toDate(input)
  if (!date) return ''

  const minute = 60 * 1000
  const hour = 60 * minute
  const diff = now.getTime() - date.getTime()

  if (diff < 0) return formatDate(date, 'YYYY-MM-DD HH:mm')
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (isSameDay(date, now)) return `${Math.floor(diff / hour)} 小时前`

  const dayDiff = daysBetween(date, now)
  if (dayDiff === 1) return '昨天'
  if (dayDiff < 7) return `${dayDiff} 天前`

  return formatDate(date, 'YYYY-MM-DD')
}

/** 记录坚持了多少天，用于「我的」页面展示 */
export function daysBetween(from: Date | string | number, to: Date | string | number = new Date()) {
  const start = toDate(from)
  const end = toDate(to)
  if (!start || !end) return 0

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  return Math.max(0, Math.round((endDay - startDay) / (24 * 60 * 60 * 1000)))
}
