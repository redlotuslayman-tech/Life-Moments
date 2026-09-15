<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'

onLaunch(() => {
  // 初始化平台信息、主题、网络状态
  useAppStore().init()
})

onShow(() => {
  useAppStore().refreshNetwork()
})

onHide(() => {
  // 小程序切后台时，可在这里把未提交的草稿落盘
})
</script>

<style lang="scss">
@import './styles/common.scss';
</style>
