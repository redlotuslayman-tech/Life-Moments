<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import * as storage from '@/platform/storage'

const appStore = useAppStore()
const storageInfo = ref(storage.info())

function onThemeChange(event: Event): void {
  const detail = (event as unknown as { detail: { value: boolean } }).detail
  appStore.setTheme(detail.value ? 'dark' : 'light')
}

function clearCache(): void {
  const { keys } = storage.info()
  keys.filter((key) => key.startsWith('lm_')).forEach((key) => storage.remove(key))
  storageInfo.value = storage.info()
  uni.showToast({ title: '已清除本地缓存', icon: 'none' })
}
</script>

<template>
  <view class="page-container settings">
    <view class="card">
      <view class="row-between settings__item">
        <text>深色模式</text>
        <switch :checked="appStore.theme === 'dark'" @change="onThemeChange" />
      </view>
      <view class="row-between settings__item">
        <text>当前平台</text>
        <text class="text-secondary">{{ appStore.platform }}</text>
      </view>
      <view class="row-between settings__item">
        <text>网络状态</text>
        <text class="text-secondary">{{ appStore.networkType }}</text>
      </view>
    </view>

    <view class="card settings__block">
      <view class="row-between settings__item">
        <text>本地缓存</text>
        <text class="text-secondary">{{ storageInfo.currentSize }} KB</text>
      </view>
      <view class="row-between settings__item" @click="clearCache">
        <text>清除缓存</text>
        <text class="text-secondary">›</text>
      </view>
    </view>

    <view class="card settings__block">
      <view class="row-between settings__item">
        <text>版本</text>
        <text class="text-secondary">0.1.0</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.settings {
  &__block {
    margin-top: $lm-space-md;
  }

  &__item {
    padding: $lm-space-md 0;

    & + & {
      border-top: 1rpx solid $lm-border-color;
    }
  }
}
</style>
