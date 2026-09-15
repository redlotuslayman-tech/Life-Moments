import { get, post } from './request'
import type { UserProfile } from '@/types'
import type { AuthCredential } from '@/platform/auth'

const USE_MOCK = import.meta.env.VITE_APP_USE_MOCK === 'true'

export interface LoginResult {
  token: string
  user: UserProfile
}

/** 登录：把端上拿到的凭证（微信 code / 短信验证码 / Apple token）交给服务端 */
export function login(credential: AuthCredential): Promise<LoginResult> {
  if (USE_MOCK) {
    return Promise.resolve({
      token: `mock_token_${Date.now().toString(36)}`,
      user: {
        id: 'u_1',
        nickname: '记录生活的人',
        stats: { moments: 5, days: 7 },
      },
    })
  }
  return post<LoginResult>('/auth/login', { ...credential })
}

/** 拉取当前登录用户信息 */
export function fetchProfile(): Promise<UserProfile> {
  if (USE_MOCK) {
    return Promise.resolve({
      id: 'u_1',
      nickname: '记录生活的人',
      stats: { moments: 5, days: 7 },
    })
  }
  return get<UserProfile>('/user/profile')
}

/** 退出登录 */
export function logout(): Promise<void> {
  if (USE_MOCK) return Promise.resolve()
  return post<void>('/auth/logout')
}
