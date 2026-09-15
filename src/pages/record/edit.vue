<script setup lang="ts">
import { computed, ref } from 'vue'
import { MOODS, type MoodValue } from '@/constants'
import { chooseImages, previewImage } from '@/platform/media'
import { useMomentStore } from '@/stores/moment'

const momentStore = useMomentStore()

const title = ref('')
const content = ref('')
const mood = ref<MoodValue | undefined>(undefined)
const images = ref<string[]>([])

const canSubmit = computed(() => title.value.trim().length > 0 && content.value.trim().length > 0)

function toggleMood(value: MoodValue): void {
  mood.value = mood.value === value ? undefined : value
}

async function pickImages(): Promise<void> {
  try {
    const selected = await chooseImages({ count: Math.max(1, 9 - images.value.length) })
    images.value = [...images.value, ...selected]
  } catch {
    // 用户取消选择时不打扰
  }
}

function removeImage(index: number): void {
  images.value.splice(index, 1)
}

async function submit(): Promise<void> {
  if (!canSubmit.value) {
    uni.showToast({ title: '标题和内容都要写哦', icon: 'none' })
    return
  }

  try {
    await momentStore.create({
      title: title.value.trim(),
      content: content.value.trim(),
      mood: mood.value,
      images: images.value,
      tags: [],
    })
    uni.showToast({ title: '已记下', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 600)
  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '保存失败',
      icon: 'none',
    })
  }
}
</script>

<template>
  <view class="page-container record">
    <input v-model="title" class="record__title" placeholder="给这个瞬间起个标题" maxlength="40" />

    <textarea
      v-model="content"
      class="record__content"
      placeholder="此刻发生了什么？"
      maxlength="1000"
      auto-height
    />

    <view class="record__section">
      <text class="record__label">心情</text>
      <view class="record__moods">
        <view
          v-for="item in MOODS"
          :key="item.value"
          class="record__mood"
          :class="{ 'record__mood--active': mood === item.value }"
          @click="toggleMood(item.value)"
        >
          <text>{{ item.emoji }}</text>
          <text class="record__mood-label">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <view class="record__section">
      <text class="record__label">照片（最多 9 张）</text>
      <view class="record__images">
        <view v-for="(image, index) in images" :key="index" class="record__image-wrap">
          <image class="record__image" :src="image" mode="aspectFill" @click="previewImage(images, image)" />
          <text class="record__image-remove" @click.stop="removeImage(index)">×</text>
        </view>
        <view v-if="images.length < 9" class="record__image-add" @click="pickImages">＋</view>
      </view>
    </view>

    <button class="btn-primary record__submit" :disabled="momentStore.submitting" @click="submit">
      {{ momentStore.submitting ? '保存中…' : '保存这一刻' }}
    </button>
  </view>
</template>

<style lang="scss" scoped>
.record {
  &__title {
    padding: $lm-space-md 0;
    border-bottom: 1rpx solid $lm-border-color;
    font-size: $lm-font-lg;
  }

  &__content {
    width: 100%;
    min-height: 240rpx;
    padding: $lm-space-md 0;
    font-size: $lm-font-md;
    line-height: 1.7;
  }

  &__section {
    margin-top: $lm-space-md;
  }

  &__label {
    display: block;
    margin-bottom: $lm-space-sm;
    color: $lm-text-secondary;
    font-size: $lm-font-sm;
  }

  &__moods {
    display: flex;
    flex-wrap: wrap;
  }

  &__mood {
    display: flex;
    align-items: center;
    margin: 0 $lm-space-sm $lm-space-sm 0;
    padding: 8rpx $lm-space-sm;
    border: 1rpx solid $lm-border-color;
    border-radius: $lm-radius-lg;
    background-color: $lm-bg-card;

    &--active {
      border-color: $lm-color-brand;
      background-color: $lm-color-brand-light;
    }
  }

  &__mood-label {
    margin-left: 8rpx;
    font-size: $lm-font-sm;
  }

  &__images {
    display: flex;
    flex-wrap: wrap;
  }

  &__image-wrap {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    margin: 0 $lm-space-sm $lm-space-sm 0;
  }

  &__image {
    width: 200rpx;
    height: 200rpx;
    border-radius: $lm-radius-sm;
  }

  &__image-remove {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: $lm-font-sm;
    line-height: 40rpx;
    text-align: center;
  }

  &__image-add {
    width: 200rpx;
    height: 200rpx;
    border: 1rpx dashed $lm-border-color;
    border-radius: $lm-radius-sm;
    color: $lm-text-secondary;
    font-size: 56rpx;
    line-height: 200rpx;
    text-align: center;
  }

  &__submit {
    margin-top: $lm-space-xl;
  }
}
</style>
