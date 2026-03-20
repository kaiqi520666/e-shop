<template>
  <div class="p-4 pt-22">
    <PageHeader title="消费记录" />

    <TabBar v-model="currentTab" :tabs="tabs" mb="mb-4" @update:model-value="handleTabChange" />

    <div
      ref="scrollContainer"
      class="scrollbar-hide min-h-50 max-h-[calc(100vh-170px)] space-y-3 overflow-y-auto"
      @scroll="handleScroll"
    >
      <div v-if="initialLoading" class="py-12 text-center text-sm text-gray-400">记录加载中...</div>

      <div v-else-if="errorMessage" class="py-12 text-center">
        <EmptyState text="记录加载失败" />
        <button class="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm text-white" @click="retryLoad">
          重新加载
        </button>
      </div>

      <template v-else-if="transactions.length > 0">
        <div
          v-for="record in transactions"
          :key="record.id"
          class="rounded-xl border border-[#334155] bg-white/5 p-4 backdrop-blur-md"
        >
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="rounded-lg p-2" :style="{ backgroundColor: getTypeConfig(record.type).color + '20' }">
                <component
                  :is="getTypeConfig(record.type).icon"
                  class="h-5 w-5"
                  :style="{ color: getTypeConfig(record.type).color }"
                />
              </div>
              <div>
                <div class="font-medium text-white">{{ getTypeConfig(record.type).label }}</div>
                <div class="text-xs text-gray-500">{{ record.createTime }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold" :class="Number(record.amount) > 0 ? 'text-[#00FFA3]' : 'text-white'">
                {{ Number(record.amount) > 0 ? '+' : '' }}{{ record.amount }} USDT
              </div>
              <div class="text-xs text-gray-500">余额: {{ record.balanceAfter }}</div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="rounded px-2 py-1 text-xs" :class="getStatusClass(record.status)">
              {{ getStatusText(record.status) }}
            </div>
            <div v-if="record.remark" class="text-xs text-gray-400">{{ record.remark }}</div>
          </div>
        </div>

        <div class="py-4 text-center">
          <span v-if="loading" class="text-gray-400">加载中...</span>
          <span v-else-if="finished" class="text-gray-500">没有更多了</span>
          <span v-else-if="loadMoreError" class="text-rose-400">加载更多失败，请继续上滑重试</span>
        </div>
      </template>

      <EmptyState v-else text="暂无记录" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import TabBar from '@/components/TabBar.vue'
import EmptyState from '@/components/EmptyState.vue'
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, RotateCcw, Coins, FileX } from 'lucide-vue-next'
import { useTransactionStore } from '@/stores'
import { useUi } from '@/composables/useUi'

const route = useRoute()
const transactionStore = useTransactionStore()
const { toast } = useUi()

const transactions = ref([])
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
  { value: 0, label: '充值' },
  { value: 1, label: '提现' },
  { value: 2, label: '下单' },
  { value: 3, label: '退款' },
  { value: 4, label: '佣金' },
]

const typeConfigs = {
  0: { label: 'USDT 充值', icon: ArrowDownLeft, color: '#00FFA3' },
  1: { label: 'USDT 提现', icon: ArrowUpRight, color: '#EF4444' },
  2: { label: '下单消费', icon: ShoppingCart, color: '#3B82F6' },
  3: { label: '退款', icon: RotateCcw, color: '#F59E0B' },
  4: { label: '代理佣金', icon: Coins, color: '#8B5CF6' },
}

const getTypeConfig = (type) => {
  return typeConfigs[type] || { label: '未知', icon: FileX, color: '#6B7280' }
}

const getStatusText = (status) => {
  const texts = { 0: '待审核', 1: '已完成', 2: '已拒绝' }
  return texts[status] || '未知'
}

const getStatusClass = (status) => {
  const classes = {
    0: 'bg-yellow-500/20 text-yellow-400',
    1: 'bg-green-500/20 text-green-400',
    2: 'bg-red-500/20 text-red-400',
  }
  return classes[status] || classes[0]
}

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
    const res = await transactionStore.getList({
      page: page.value,
      size,
      type: status === -1 ? undefined : status,
    })

    const newList = res.data?.list || []
    if (reset) {
      transactions.value = newList
    } else {
      transactions.value.push(...newList)
    }

    if (newList.length < size) {
      finished.value = true
    } else {
      page.value += 1
    }
  } catch (error) {
    if (reset) {
      errorMessage.value = error.message || '记录加载失败'
      transactions.value = []
    } else {
      loadMoreError.value = error.message || '加载更多失败'
      toast.error(loadMoreError.value)
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
  transactions.value = []
  await loadList(tabValue, true)
}

const retryLoad = async () => {
  await loadList(currentTab.value, true)
}

const init = () => {
  const tab = Number(route.query.tab)
  if (!Number.isNaN(tab)) {
    currentTab.value = tab
  }
  loadList(currentTab.value, true)
}

init()
</script>
