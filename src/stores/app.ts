import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/constants'
import * as storage from '@/platform/storage'
import { getPlatformName } from '@/platform'

export type ThemeName = 'light' | 'dark'

type NetworkType = 'wifi' | '2g' | '3g' | '4g' | '5g' | 'ethernet' | 'unknown' | 'none'

/** 应用级状态：当前平台、主题、网络 */
export const useAppStore = defineStore('app', () => {
  const platform = ref(getPlatformName())
  const theme = ref<ThemeName>('light')
  const networkType = ref<NetworkType>('unknown')

  const isOnline = computed(() => networkType.value !== 'none')

  function init(): void {
    theme.value = storage.get<ThemeName>(STORAGE_KEYS.theme, 'light')
    refreshNetwork()
  }

  function refreshNetwork(): void {
    uni.getNetworkType({
      success: (res) => {
        networkType.value = res.networkType as NetworkType
      },
    })
  }

  function setTheme(next: ThemeName): void {
    theme.value = next
    storage.set(STORAGE_KEYS.theme, next)
  }

  function toggleTheme(): void {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    platform,
    theme,
    networkType,
    isOnline,
    init,
    refreshNetwork,
    setTheme,
    toggleTheme,
  }
})
