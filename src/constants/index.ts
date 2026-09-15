/** 本地存储的 key，统一在这里维护，避免各处写魔法字符串 */
export const STORAGE_KEYS = {
  token: 'lm_token',
  user: 'lm_user',
  theme: 'lm_theme',
  draft: 'lm_record_draft',
} as const

/** 路由表：页面跳转统一走这里，方便后续改路径 */
export const ROUTES = {
  index: '/pages/index/index',
  recordEdit: '/pages/record/edit',
  mine: '/pages/mine/index',
  momentDetail: '/pagesSub/moment/detail',
  settings: '/pagesSub/settings/index',
} as const

/** 心情选项：记录时刻的标签 */
export const MOODS = [
  { value: 'happy', label: '开心', emoji: '😄' },
  { value: 'calm', label: '平静', emoji: '🌿' },
  { value: 'excited', label: '激动', emoji: '🎉' },
  { value: 'tired', label: '疲惫', emoji: '😮‍💨' },
  { value: 'sad', label: '失落', emoji: '🌧️' },
] as const

export type MoodValue = (typeof MOODS)[number]['value']

/** 分页大小 */
export const PAGE_SIZE = 20
