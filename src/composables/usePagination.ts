import { ref, type Ref } from 'vue'
import type { PageResult } from '@/types'
import { PAGE_SIZE } from '@/constants'

export interface PaginationParams {
  page: number
  pageSize: number
  keyword?: string
}

export interface UsePaginationOptions<T> {
  fetcher: (params: PaginationParams) => Promise<PageResult<T>>
  pageSize?: number
}

/** 通用分页逻辑：列表页的下拉刷新与触底加载都复用它 */
export function usePagination<T>(options: UsePaginationOptions<T>) {
  const { fetcher, pageSize = PAGE_SIZE } = options

  const list = ref([]) as Ref<T[]>
  const page = ref(1)
  const total = ref(0)
  const hasMore = ref(true)
  const loading = ref(false)
  const error = ref('')
  const keyword = ref('')

  async function load(reset = false): Promise<void> {
    if (loading.value) return
    if (!reset && !hasMore.value) return
    if (reset) {
      page.value = 1
      hasMore.value = true
    }

    loading.value = true
    error.value = ''

    try {
      const result = await fetcher({
        page: page.value,
        pageSize,
        keyword: keyword.value || undefined,
      })
      list.value = reset ? result.list : [...list.value, ...result.list]
      total.value = result.total
      hasMore.value = result.hasMore
      page.value += 1
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  return {
    list,
    page,
    total,
    hasMore,
    loading,
    error,
    keyword,
    refresh: () => load(true),
    loadMore: () => load(false),
  }
}
