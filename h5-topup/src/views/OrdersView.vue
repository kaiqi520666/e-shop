<template>
  <div class="p-4">
    <TabBar :model-value="currentTab" :tabs="tabs" @update:model-value="handleTabChange" />
    <AppDivider />

    <div
      ref="scrollContainer"
      class="scrollbar-hide min-h-50 max-h-[calc(100vh-170px)] space-y-3 overflow-y-auto"
      @scroll="handleScroll"
    >
      <div v-if="initialLoading" class="py-12 text-center text-sm text-gray-400">订单加载中...</div>

      <div v-else-if="errorMessage" class="py-12 text-center">
        <EmptyState text="订单加载失败" />
        <button class="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm text-white" @click="retryLoad">
          重新加载
        </button>
      </div>

      <template v-else-if="orderList.length > 0">
        <div
          v-for="order in orderList"
          :key="order.id"
          class="cursor-pointer rounded-xl border border-[#334155] bg-white/5 p-4 backdrop-blur-md"
          @click="router.push(`/orders/${order.orderNo}`)"
        >
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <component :is="getOrderIcon(order.categoryKeyword)" class="h-5 w-5 text-[#00FFA3]" />
              <span class="font-medium text-white">{{ order.categoryName }}</span>
            </div>
            <span class="rounded px-2 py-1 text-xs font-medium" :class="getStatusBadgeClass(order.status)">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-xs text-gray-400">充值金额</div>
              <div class="text-lg font-semibold text-white">¥{{ order.rmbAmount }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400">USDT</div>
              <div class="font-semibold text-[#00FFA3]">{{ order.usdtAmount }}</div>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-[#334155] pt-3">
            <span class="text-xs text-gray-500">{{ order.createTime }}</span>
            <button class="flex items-center gap-1 text-xs text-gray-400" @click.stop="copyOrderNo(order.orderNo)">
              订单号 {{ order.orderNo }}
              <Copy class="h-3 w-3" />
            </button>
          </div>
        </div>

        <div class="py-4 text-center">
          <span v-if="loading" class="text-gray-400">加载中...</span>
          <span v-else-if="finished" class="text-gray-500">没有更多了</span>
          <span v-else-if="loadMoreError" class="text-rose-400">加载更多失败，请继续上滑重试</span>
        </div>
      </template>

      <EmptyState v-else text="暂无订单" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Copy } from 'lucide-vue-next'
import { useOrderStore } from '@/stores'
import { useOrderStatus } from '@/composables/useOrderStatus'
import { useUi } from '@/composables/useUi'
import TabBar from '@/components/TabBar.vue'
import EmptyState from '@/components/EmptyState.vue'
import AppDivider from '@/components/AppDivider.vue'
import { copyText } from '@/utils/clipboard'

const router = useRouter()
const orderStore = useOrderStore()
const { getOrderIcon, getStatusBadgeClass, getStatusLabel } = useOrderStatus()
const { toast } = useUi()

const orderList = ref([])
const currentTab = ref(-1)
const scrollContainer = ref(null)
const page = ref(1)
const size = 10
const loading = ref(false)
const finished = ref(false)
const initialLoading = ref(false)
const errorMessage = ref('')
const loadMoreError = ref('')

const tabs = [
  { value: -1, label: '全部' },
  { value: 0, label: '待充值' },
  { value: 1, label: '充值中' },
  { value: 2, label: '已成功' },
  { value: 3, label: '已取消' },
]

const loadList = async (status, reset = false) => {
  if (loading.value) {
    return
  }

  loading.value = true
  loadMoreError.value = ''

  if (reset) {
    page.value = 1
    finished.value = false
    errorMessage.value = ''
    initialLoading.value = true
  }

  try {
    const res = await orderStore.getList({
      page: page.value,
      size,
      status: status === -1 ? undefined : status,
    })

    const newList = res.data?.list || []

    if (reset) {
      orderList.value = newList
    } else {
      orderList.value.push(...newList)
    }

    if (newList.length < size) {
      finished.value = true
    } else {
      page.value += 1
    }
  } catch (error) {
    if (reset) {
      errorMessage.value = error.message || '订单加载失败'
      orderList.value = []
    } else {
      loadMoreError.value = error.message || '加载更多失败'
    }
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

const handleScroll = () => {
  if (!scrollContainer.value) {
    return
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  if (scrollTop + clientHeight >= scrollHeight - 50 && !finished.value && !loading.value) {
    loadList(currentTab.value)
  }
}

const handleTabChange = async (tabValue) => {
  currentTab.value = tabValue
  orderList.value = []
  await loadList(tabValue, true)
}

const retryLoad = async () => {
  await loadList(currentTab.value, true)
}

const copyOrderNo = async (orderNo) => {
  const copied = await copyText(orderNo)
  if (copied) {
    toast.success('已复制')
  } else {
    toast.error('复制失败，请手动长按选择复制')
  }
}

onMounted(() => {
  loadList(currentTab.value, true)
})
</script>
