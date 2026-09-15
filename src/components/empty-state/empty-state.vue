<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    emoji?: string
  }>(),
  {
    text: '这里还什么都没有',
    emoji: '🌱',
  },
)
</script>

<template>
  <view class="empty-state">
    <text class="empty-state__emoji">{{ emoji }}</text>
    <text class="empty-state__text">{{ text }}</text>
  </view>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $lm-space-xl 0;

  &__emoji {
    font-size: 72rpx;
  }

  &__text {
    margin-top: $lm-space-sm;
    color: $lm-text-secondary;
    font-size: $lm-font-sm;
  }
}
</style>
