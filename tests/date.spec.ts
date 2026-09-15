import { describe, expect, it } from 'vitest'
import { daysBetween, formatDate, fromNow, isSameDay, toDate } from '../src/utils/date'

describe('utils/date', () => {
  it('toDate 兼容时间戳、ISO 与 "YYYY-MM-DD HH:mm" 字符串', () => {
    expect(toDate('2026-09-15 10:30')?.getHours()).toBe(10)
    expect(toDate('2026-09-15T10:30:00+08:00')).toBeInstanceOf(Date)
    expect(toDate('not-a-date')).toBeNull()
  })

  it('formatDate 按 pattern 输出', () => {
    const date = new Date(2026, 8, 15, 9, 5, 3)
    expect(formatDate(date)).toBe('2026-09-15 09:05')
    expect(formatDate(date, 'YYYY年MM月DD日')).toBe('2026年09月15日')
    expect(formatDate(date, 'HH:mm:ss')).toBe('09:05:03')
    expect(formatDate('')).toBe('')
  })

  it('isSameDay 判断同一天', () => {
    expect(isSameDay(new Date(2026, 8, 15, 0, 1), new Date(2026, 8, 15, 23, 59))).toBe(true)
    expect(isSameDay(new Date(2026, 8, 15), new Date(2026, 8, 16))).toBe(false)
  })

  it('fromNow 输出相对时间', () => {
    const now = new Date(2026, 8, 15, 12, 0, 0)
    expect(fromNow(new Date(2026, 8, 15, 11, 59, 30), now)).toBe('刚刚')
    expect(fromNow(new Date(2026, 8, 15, 11, 30, 0), now)).toBe('30 分钟前')
    expect(fromNow(new Date(2026, 8, 15, 8, 0, 0), now)).toBe('4 小时前')
    expect(fromNow(new Date(2026, 8, 14, 20, 0, 0), now)).toBe('昨天')
    expect(fromNow(new Date(2026, 8, 12, 12, 0, 0), now)).toBe('3 天前')
    expect(fromNow(new Date(2026, 8, 1, 12, 0, 0), now)).toBe('2026-09-01')
  })

  it('daysBetween 计算相差天数', () => {
    expect(daysBetween(new Date(2026, 8, 1), new Date(2026, 8, 15))).toBe(14)
    expect(daysBetween(new Date(2026, 8, 20), new Date(2026, 8, 15))).toBe(0)
  })
})
