<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import EmptyState from '@/components/empty-state/empty-state.vue'
import { MOODS } from '@/constants'
import { previewImage } from '@/platform/media'
import { cacheShareContent } from '@/platform/share'
import { useMomentStore } from '@/stores/moment'
import { formatDate } from '@/utils/date'
import type { Moment } from '@/types'

const momentStore = useMomentStore()
const moment = ref<Moment | null>(null)
const error = ref('')

onLoad(async (options) => {
  const id = String(options?.id ?? '')
  if (!id) {
    error.value = '缺少记录 ID'
    return
  }

  try {
    moment.value = await momentStore.loadDetail(id)
    // 小程序端分享内容需要提前缓存，页面里声明 onShareAppMessage 时再取
    cacheShareContent(`/pagesSub/moment/detail?id=${id}`, {
      title: moment.value.title,
      path: `/pagesSub/moment/detail?id=${id}`,
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  }
})

// 仅小程序生效：右上角转发卡片内容
onShareAppMessage(() => {
  const current = moment.value
  return {
    title: current ? `我在 Life-Moments 记下了「${current.title}」` : 'Life-Moments',
    path: current ? `/pagesSub/moment/detail?id=${current.id}` : '/pages/index/index',
  }
})

function moodText(value?: string): string {
  const found = MOODS.find((item) => item.value === value)
  return found ? `${found.emoji} ${found.label}` : ''
}
</script>

<template>
  <view class="page-container detail">
    <EmptyState v-if="error" text="这条记录不见了" emoji="🌫️" />

    <template v-else-if="moment">
      <text class="detail__title">{{ moment.title }}</text>
      <view class="detail__meta">
        <text class="text-secondary">{{ formatDate(moment.createdAt, 'YYYY-MM-DD HH:mm') }}</text>
        <text v-if="moment.mood" class="detail__mood">{{ moodText(moment.mood) }}</text>
      </view>

      <text class="detail__content">{{ moment.content }}</text>

      <view v-if="moment.images.length" class="detail__images">
        <image
          v-for="(image, index) in moment.images"
          :key="index"
          class="detail__image"
          :src="image"
          mode="aspectFill"
          @click="previewImage(moment.images, image)"
        />
      </view>

      <view v-if="moment.location" class="card detail__location">
        <text class="text-secondary">地点</text>
        <text>{{ moment.location.name }}</text>
      </view>

      <view class="detail__actions">
        <button class="detail__action" open-type="share">分享给朋友</button>
      </view>
    </template>

    <view v-else class="detail__loading">加载中…</view>
  </view>
</template>

<style lang="scss" scoped>
.detail {
  &__title {
    display: block;
    font-size: $lm-font-xl;
    font-weight: 600;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin-top: $lm-space-xs;
  }

  &__mood {
    margin-left: $lm-space-sm;
    color: $lm-color-brand;
    font-size: $lm-font-sm;
  }

  &__content {
    display: block;
    margin-top: $lm-space-md;
    font-size: $lm-font-md;
    line-height: 1.8;
  }

  &__images {
    display: flex;
    flex-wrap: wrap;
    margin-top: $lm-space-md;
  }

  &__image {
    width: 220rpx;
    height: 220rpx;
    margin: 0 $lm-space-sm $lm-space-sm 0;
    border-radius: $lm-radius-sm;
  }

  &__location {
    display: flex;
    justify-content: space-between;
    margin-top: $lm-space-md;
  }

  &__actions {
    margin-top: $lm-space-xl;
  }

  &__action {
    background-color: $lm-bg-card;
    color: $lm-color-brand;
    border-radius: $lm-radius-lg;
    font-size: $lm-font-md;
  }

  &__loading {
    padding: $lm-space-xl 0;
    color: $lm-text-secondary;
    text-align: center;
  }
}
</style>
