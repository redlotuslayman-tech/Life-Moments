import { del, get, post, put } from './request'
import { MOCK_MOMENTS } from './mock/moments'
import { PAGE_SIZE } from '@/constants'
import type { Moment, MomentDraft, PageResult } from '@/types'

const USE_MOCK = import.meta.env.VITE_APP_USE_MOCK === 'true'

export interface FetchMomentsParams {
  page?: number
  pageSize?: number
  keyword?: string
}

/* ---------------- mock 实现（去掉后端依赖，先让页面跑起来） ---------------- */

let mockData: Moment[] = [...MOCK_MOMENTS]

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function mockFetchMoments(params: FetchMomentsParams = {}): Promise<PageResult<Moment>> {
  const { page = 1, pageSize = PAGE_SIZE, keyword } = params
  const filtered = keyword
    ? mockData.filter(
        (item) => item.title.includes(keyword) || item.content.includes(keyword),
      )
    : mockData
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)

  return delay({
    list,
    total: filtered.length,
    page,
    pageSize,
    hasMore: start + list.length < filtered.length,
  })
}

/* ---------------- 真实接口 ---------------- */

/** 时间轴列表 */
export function fetchMoments(params: FetchMomentsParams = {}): Promise<PageResult<Moment>> {
  if (USE_MOCK) return mockFetchMoments(params)
  return get<PageResult<Moment>>('/moments', { ...params })
}

/** 记录详情 */
export function fetchMomentDetail(id: string): Promise<Moment> {
  if (USE_MOCK) {
    const found = mockData.find((item) => item.id === id)
    return found
      ? delay(found)
      : Promise.reject(new Error('这条记录不存在或已被删除'))
  }
  return get<Moment>(`/moments/${id}`)
}

/** 新建记录 */
export function createMoment(draft: MomentDraft): Promise<Moment> {
  if (USE_MOCK) {
    const created: Moment = {
      id: `m_${Date.now().toString(36)}`,
      title: draft.title,
      content: draft.content,
      mood: draft.mood,
      images: draft.images ?? [],
      location: draft.location,
      tags: draft.tags ?? [],
      createdAt: new Date().toISOString(),
    }
    mockData = [created, ...mockData]
    return delay(created)
  }
  return post<Moment>('/moments', { ...draft })
}

/** 编辑记录 */
export function updateMoment(id: string, draft: Partial<MomentDraft>): Promise<Moment> {
  if (USE_MOCK) {
    const index = mockData.findIndex((item) => item.id === id)
    if (index < 0) return Promise.reject(new Error('这条记录不存在'))
    mockData[index] = { ...mockData[index], ...draft, updatedAt: new Date().toISOString() }
    return delay(mockData[index])
  }
  return put<Moment>(`/moments/${id}`, { ...draft })
}

/** 删除记录 */
export function removeMoment(id: string): Promise<void> {
  if (USE_MOCK) {
    mockData = mockData.filter((item) => item.id !== id)
    return delay(undefined)
  }
  return del<void>(`/moments/${id}`)
}
