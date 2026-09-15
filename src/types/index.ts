import type { MoodValue } from '@/constants'

/** 一条「时刻」记录 */
export interface Moment {
  id: string
  title: string
  content: string
  mood?: MoodValue
  images: string[]
  location?: {
    name: string
    latitude?: number
    longitude?: number
  }
  tags: string[]
  createdAt: string
  updatedAt?: string
}

/** 新建 / 编辑记录时提交的数据 */
export type MomentDraft = Pick<Moment, 'title' | 'content'> &
  Partial<Pick<Moment, 'mood' | 'images' | 'location' | 'tags'>>

/** 用户信息 */
export interface UserProfile {
  id: string
  nickname: string
  avatar?: string
  /** 记录数量等统计信息 */
  stats?: {
    moments: number
    days: number
  }
}

/** 分页返回结构 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
