<script setup lang="ts">
import { ref } from 'vue'
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import EmptyState from '@/components/empty-state/empty-state.vue'
import MomentCard from '@/components/moment-card/moment-card.vue'
import { ROUTES } from '@/constants'
import { useAppStore } from '@/stores/app'
import { useMomentStore } from '@/stores/moment'
import type { Moment } from '@/types'

const appStore = useAppStore()
const momentStore = useMomentStore()
const loaded = ref(false)

onShow(async () => {
  // 从「记录此刻」返回时也会走到这里，保证列表是最新的
  await momentStore.refresh()
  loaded.value = true
})

onPullDownRefresh(async () => {
  await momentStore.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  momentStore.loadMore()
})

function goDetail(moment: Moment): void {
  uni.navigateTo({ url: `${ROUTES.momentDetail}?id=${moment.id}` })
}

function goCreate(): void {
  uni.navigateTo({ url: ROUTES.recordEdit })
}
</script>

<template>
  <view class="page-container timeline">
    <view class="timeline__hero">
      <text class="timeline__hello">记录生命中的美好时刻</text>
      <text class="timeline__count">
        已经记下 {{ momentStore.total }} 个瞬间 · 平台 {{ appStore.platform }}
      </text>
    </view>

    <view v-if="!loaded" class="timeline__loading">正在加载…</view>

    <EmptyState v-else-if="!momentStore.list.length" text="还没有记录，写下第一刻吧" />

    <MomentCard
      v-for="item in momentStore.list"
      :key="item.id"
      :moment="item"
      @select="goDetail"
    />

    <view v-if="momentStore.list.length" class="timeline__more">
      <text v-if="momentStore.loading">加载中…</text>
      <text v-else-if="momentStore.hasMore">上拉加载更多</text>
      <text v-else>没有更多了</text>
    </view>

    <button class="btn-primary timeline__fab" @click="goCreate">＋ 记录此刻</button>
  </view>
</template>

<style lang="scss" scoped>
.timeline {
  padding-bottom: 200rpx;

  &__hero {
    margin-bottom: $lm-space-lg;
  }

  &__hello {
    display: block;
    color: $lm-text-primary;
    font-size: $lm-font-xl;
    font-weight: 600;
  }

  &__count {
    display: block;
    margin-top: $lm-space-xs;
    color: $lm-text-secondary;
    font-size: $lm-font-sm;
  }

  &__loading,
  &__more {
    padding: $lm-space-md 0;
    color: $lm-text-secondary;
    font-size: $lm-font-xs;
    text-align: center;
  }

  &__fab {
    position: fixed;
    right: $lm-space-lg;
    bottom: 140rpx;
    padding: 0 $lm-space-lg;
    height: 88rpx;
    line-height: 88rpx;
    box-shadow: 0 8rpx 24rpx rgba(242, 115, 74, 0.35);
  }
}
</style>
