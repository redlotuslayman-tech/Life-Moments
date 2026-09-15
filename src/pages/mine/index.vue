<script setup lang="ts">
import { computed } from 'vue'
import { ROUTES } from '@/constants'
import { useMomentStore } from '@/stores/moment'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const momentStore = useMomentStore()

const stats = computed(() => [
  { label: '记录', value: momentStore.total || userStore.profile?.stats?.moments || 0 },
  { label: '坚持天数', value: userStore.profile?.stats?.days ?? 0 },
])

async function handleLogin(): Promise<void> {
  try {
    await userStore.login()
    uni.showToast({ title: '登录成功', icon: 'success' })
  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '登录失败',
      icon: 'none',
    })
  }
}

function goSettings(): void {
  uni.navigateTo({ url: ROUTES.settings })
}
</script>

<template>
  <view class="page-container mine">
    <view class="card mine__profile">
      <image class="mine__avatar" :src="userStore.profile?.avatar || ''" mode="aspectFill" />
      <view class="mine__info">
        <text class="mine__nickname">{{ userStore.nickname }}</text>
        <text class="text-secondary">
          {{ userStore.isLoggedIn ? '已同步到云端' : '登录后可多端同步' }}
        </text>
      </view>
      <button v-if="!userStore.isLoggedIn" class="btn-primary mine__login" @click="handleLogin">
        登录
      </button>
    </view>

    <view class="card mine__stats">
      <view v-for="item in stats" :key="item.label" class="mine__stat">
        <text class="mine__stat-value">{{ item.value }}</text>
        <text class="text-secondary">{{ item.label }}</text>
      </view>
    </view>

    <view class="card mine__menu">
      <view class="row-between mine__menu-item" @click="goSettings">
        <text>设置</text>
        <text class="text-secondary">›</text>
      </view>
      <view v-if="userStore.isLoggedIn" class="row-between mine__menu-item" @click="userStore.logout()">
        <text>退出登录</text>
        <text class="text-secondary">›</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mine {
  &__profile {
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    background-color: $lm-bg-page;
  }

  &__info {
    flex: 1;
    margin-left: $lm-space-md;
  }

  &__nickname {
    display: block;
    margin-bottom: 8rpx;
    font-size: $lm-font-lg;
    font-weight: 600;
  }

  &__login {
    margin: 0;
    padding: 0 $lm-space-md;
    height: 64rpx;
    line-height: 64rpx;
    font-size: $lm-font-sm;
  }

  &__stats {
    display: flex;
    margin-top: $lm-space-md;
  }

  &__stat {
    flex: 1;
    text-align: center;
  }

  &__stat-value {
    display: block;
    color: $lm-color-brand;
    font-size: $lm-font-xl;
    font-weight: 600;
  }

  &__menu {
    margin-top: $lm-space-md;
    padding: 0 $lm-space-md;
  }

  &__menu-item {
    padding: $lm-space-md 0;

    & + & {
      border-top: 1rpx solid $lm-border-color;
    }
  }
}
</style>
