<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** 是否给底部留出安全区与悬浮按钮的空间 */
    padded?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    padded: true,
  },
)
</script>

<template>
  <view class="page-shell" :class="{ 'page-shell--padded': padded }">
    <view v-if="title || $slots.header" class="page-shell__header">
      <slot name="header">
        <text class="page-shell__title">{{ title }}</text>
        <text v-if="subtitle" class="page-shell__subtitle">{{ subtitle }}</text>
      </slot>
    </view>

    <view class="page-shell__body">
      <slot />
    </view>

    <view v-if="$slots.footer" class="page-shell__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-shell {
  min-height: 100vh;
  box-sizing: border-box;
  background-color: $lm-bg-page;

  &--padded {
    padding: $lm-space-md;
    padding-bottom: 160rpx;
  }

  &__header {
    margin-bottom: $lm-space-md;
  }

  &__title {
    display: block;
    color: $lm-text-primary;
    font-size: $lm-font-xl;
    font-weight: 600;
  }

  &__subtitle {
    display: block;
    margin-top: $lm-space-xs;
    color: $lm-text-secondary;
    font-size: $lm-font-sm;
  }

  &__footer {
    margin-top: $lm-space-lg;
  }
}
</style>
