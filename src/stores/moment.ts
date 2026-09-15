import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { createMoment, fetchMomentDetail, fetchMoments, removeMoment } from '@/api/moment'
import { usePagination } from '@/composables/usePagination'
import type { Moment, MomentDraft } from '@/types'

/** 时刻记录：时间轴列表 + 详情 + 增删 */
export const useMomentStore = defineStore('moment', () => {
  const pagination = usePagination<Moment>({ fetcher: fetchMoments })
  const detail = ref<Moment | null>(null)
  const submitting = ref(false)

  const list = computed(() => pagination.list.value)
  const total = computed(() => pagination.total.value)
  const hasMore = computed(() => pagination.hasMore.value)
  const loading = computed(() => pagination.loading.value)
  const error = computed(() => pagination.error.value)

  async function refresh(): Promise<void> {
    await pagination.refresh()
  }

  async function loadMore(): Promise<void> {
    await pagination.loadMore()
  }

  async function loadDetail(id: string): Promise<Moment> {
    const cached = list.value.find((item) => item.id === id)
    if (cached) {
      detail.value = cached
      return cached
    }
    const found = await fetchMomentDetail(id)
    detail.value = found
    return found
  }

  async function create(draft: MomentDraft): Promise<Moment> {
    submitting.value = true
    try {
      const created = await createMoment(draft)
      await pagination.refresh()
      return created
    } finally {
      submitting.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    await removeMoment(id)
    await pagination.refresh()
  }

  return {
    list,
    total,
    hasMore,
    loading,
    error,
    keyword: pagination.keyword,
    detail,
    submitting,
    refresh,
    loadMore,
    loadDetail,
    create,
    remove,
  }
})
