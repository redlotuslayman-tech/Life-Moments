<script setup lang="ts">
import { computed } from 'vue'
import { MOODS } from '@/constants'
import { formatDate, fromNow } from '@/utils/date'
import { truncate } from '@/utils/format'
import type { Moment } from '@/types'

const props = defineProps<{
  moment: Moment
}>()

const emit = defineEmits<{
  (event: 'select', moment: Moment): void
}>()

const mood = computed(() => MOODS.find((item) => item.value === props.moment.mood))
const timeText = computed(() => formatDate(props.moment.createdAt, 'MM-DD HH:mm'))
const relativeText = computed(() => fromNow(props.moment.createdAt))
</script>

<template>
  <view class="moment-card" @click="emit('select', moment)">
    <view class="moment-card__head">
      <text class="moment-card__title">{{ moment.title }}</text>
      <text v-if="mood" class="moment-card__mood">{{ mood.emoji }} {{ mood.label }}</text>
    </view>

    <text class="moment-card__content">{{ truncate(moment.content, 60) }}</text>

    <view v-if="moment.images.length" class="moment-card__images">
      <image
        v-for="(image, index) in moment.images.slice(0, 3)"
        :key="index"
        class="moment-card__image"
        :src="image"
        mode="aspectFill"
      />
    </view>

    <view class="moment-card__foot">
      <text class="moment-card__meta">{{ relativeText }} · {{ timeText }}</text>
      <text v-if="moment.location" class="moment-card__meta">{{ moment.location.name }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.moment-card {
  @include card;

  margin-bottom: $lm-space-md;
  padding: $lm-space-md;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    flex: 1;
    color: $lm-text-primary;
    font-size: $lm-font-lg;
    font-weight: 600;
  }

  &__mood {
    flex-shrink: 0;
    margin-left: $lm-space-sm;
    color: $lm-color-brand;
    font-size: $lm-font-sm;
  }

  &__content {
    display: block;
    margin-top: $lm-space-sm;
    color: $lm-text-regular;
    font-size: $lm-font-md;
    line-height: 1.7;
  }

  &__images {
    display: flex;
    margin-top: $lm-space-sm;
  }

  &__image {
    width: 160rpx;
    height: 160rpx;
    margin-right: $lm-space-xs;
    border-radius: $lm-radius-sm;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $lm-space-sm;
  }

  &__meta {
    color: $lm-text-secondary;
    font-size: $lm-font-xs;
  }
}
</style>
