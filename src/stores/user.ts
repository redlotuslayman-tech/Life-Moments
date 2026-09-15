import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/constants'
import * as storage from '@/platform/storage'
import { defaultLoginType, getPhoneCredential, getWeixinCredential } from '@/platform/auth'
import * as userApi from '@/api/user'
import { clearToken, setToken } from '@/api/request'
import type { UserProfile } from '@/types'

/** 登录态与用户信息 */
export const useUserStore = defineStore('user', () => {
  const token = ref<string>(storage.get<string>(STORAGE_KEYS.token, ''))
  const profile = ref<UserProfile | null>(storage.get<UserProfile | null>(STORAGE_KEYS.user, null))
  const loading = ref(false)

  const isLoggedIn = computed(() => Boolean(token.value))
  const nickname = computed(() => profile.value?.nickname ?? '未登录')

  function setSession(result: userApi.LoginResult): void {
    token.value = result.token
    profile.value = result.user
    setToken(result.token)
    storage.set(STORAGE_KEYS.user, result.user)
  }

  function cleanSession(): void {
    token.value = ''
    profile.value = null
    clearToken()
    storage.remove(STORAGE_KEYS.user)
  }

  /** 微信授权登录（小程序默认方式） */
  async function loginByWeixin(): Promise<void> {
    loading.value = true
    try {
      const credential = await getWeixinCredential()
      setSession(await userApi.login(credential))
    } finally {
      loading.value = false
    }
  }

  /** 手机号登录（App 端默认方式） */
  async function loginByPhone(phone: string, smsCode: string): Promise<void> {
    loading.value = true
    try {
      const credential = await getPhoneCredential(phone, smsCode)
      setSession(await userApi.login(credential))
    } finally {
      loading.value = false
    }
  }

  /** 按平台选择默认登录方式 */
  async function login(): Promise<void> {
    if (defaultLoginType() === 'weixin') {
      await loginByWeixin()
      return
    }
    throw new Error('App 端请先补充手机号，再调用 loginByPhone')
  }

  /** 冷启动时用本地 token 换一次最新资料 */
  async function restore(): Promise<void> {
    if (!token.value) return
    try {
      profile.value = await userApi.fetchProfile()
      storage.set(STORAGE_KEYS.user, profile.value)
    } catch {
      cleanSession()
    }
  }

  async function logout(): Promise<void> {
    try {
      await userApi.logout()
    } finally {
      cleanSession()
    }
  }

  return {
    token,
    profile,
    loading,
    isLoggedIn,
    nickname,
    login,
    loginByWeixin,
    loginByPhone,
    restore,
    logout,
    cleanSession,
  }
})
