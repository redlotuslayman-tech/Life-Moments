import { describe, expect, it } from 'vitest'
import { formatCount, safeJsonParse, truncate } from '../src/utils/format'

describe('utils/format', () => {
  it('truncate 超长截断', () => {
    expect(truncate('abc', 5)).toBe('abc')
    expect(truncate('abcdefg', 3)).toBe('abc…')
    expect(truncate('')).toBe('')
  })

  it('formatCount 数字缩写', () => {
    expect(formatCount(999)).toBe('999')
    expect(formatCount(1200)).toBe('1.2k')
    expect(formatCount(20000)).toBe('2w')
  })

  it('safeJsonParse 解析失败时兜底', () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 })
    expect(safeJsonParse('broken', { a: 1 })).toEqual({ a: 1 })
  })
})
