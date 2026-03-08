<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { transactionApi } from '@/api/modules/user/transaction.api'
import Header from '@/components/layout/Header.vue'
import { ArrowDownCircle, ArrowUpCircle, ShoppingCart, Wallet, Receipt } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const user = userStore.currentUser

// Tab 相关
const tabList = ['全部', '充值', '提现', '下单', '佣金']
const activeTab = ref('全部')
const tabRefs = ref([])
const tabsContainerRef = ref(null)
const indicatorStyle = ref({ left: 0, width: 0 })

const typeMap = {
  0: 'recharge',
  1: 'withdraw',
  2: 'order',
  3: 'commission',
}

const tabToType = {
  '全部': null,
  '充值': 0,
  '提现': 1,
  '下单': 2,
  '佣金': 3,
}

const loading = ref(false)
const recordsList = ref([])

async function loadRecords() {
  loading.value = true
  try {
    const res = await transactionApi.getList({ page: 1, size: 100 })
    if (res.code === 1000) {
      recordsList.value = res.data.list
    }
  } catch (error) {
    console.error('加载交易记录失败:', error)
  } finally {
    loading.value = false
  }
}

const records = computed(() => {
  return recordsList.value.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
})

const filteredRecords = computed(() => {
  if (activeTab.value === '全部') {
    return records.value
  }
  const typeValue = tabToType[activeTab.value]
  return records.value.filter((r) => r.type === typeValue)
})

const typeConfig = {
  recharge: {
    label: '充值',
    icon: ArrowDownCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/20',
  },
  withdraw: {
    label: '提现',
    icon: ArrowUpCircle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/20',
  },
  order: { label: '下单', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/20' },
  commission: { label: '佣金', icon: Receipt, color: 'text-gold', bg: 'bg-gold/20' },
}

function getTypeConfig(type) {
  const typeKey = typeMap[type]
  const config = typeConfig[typeKey]
  return config ?? { label: '其他', icon: Wallet, color: 'text-text-muted', bg: 'bg-bg-secondary' }
}

function updateIndicator() {
  nextTick(() => {
    const activeIndex = tabList.findIndex((t) => t === activeTab.value)
    const tabEl = tabRefs.value[activeIndex]
    const containerEl = tabsContainerRef.value
    if (tabEl && containerEl) {
      const tabRect = tabEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      indicatorStyle.value = {
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      }
    }
  })
}

function setActiveTab(tab) {
  activeTab.value = tab
  updateIndicator()
}

function goToOrder(orderId) {
  if (orderId) router.push(`/orders/${orderId}`)
}

onMounted(() => {
  updateIndicator()
  loadRecords()
})
</script>

<template>
  <div class="pb-24">
    <Header title="消费记录" show-back />

    <!-- Balance Card -->
    <div class="px-4 pt-4">
      <div
        class="relative mb-6 overflow-hidden rounded-2xl border border-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.15),transparent_70%)] bg-linear-to-br from-gold/10 via-gold/5 to-transparent p-5 shadow-[0_0_20px_rgba(201,168,76,0.08)]"
      >
        <!-- Decorative glow -->
        <div class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl"></div>
        <div class="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gold/5 blur-2xl"></div>

        <div class="relative">
          <p class="text-xs font-medium uppercase tracking-wider text-gold/70">当前余额</p>
          <div class="mt-2 flex items-baseline gap-1">
            <span class="text-3xl font-bold text-gold drop-shadow-[0_2px_8px_rgba(201,168,76,0.4)]">
              {{ Number(user?.balance ?? 0).toFixed(2) }}
            </span>
            <span class="text-sm font-medium text-gold/80">USDT</span>
          </div>

          <!-- Decorative line -->
          <div class="mt-4 flex items-center gap-2">
            <div class="h-px flex-1 bg-linear-to-r from-gold/60 to-transparent"></div>
            <div class="h-1 w-1 rounded-full bg-gold"></div>
            <div class="h-px flex-1 bg-linear-to-l from-gold/40 to-transparent"></div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div
        class="sticky top-0 z-40 border-b border-border bg-bg-primary/95 backdrop-blur-sm -mx-4 px-4"
      >
        <div ref="tabsContainerRef" class="relative flex gap-1 pt-4 pb-3">
          <button
            v-for="(tab, index) in tabList"
            :key="tab"
            :ref="
              (el) => {
                if (el) tabRefs[index] = el
              }
            "
            class="relative z-10 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
            :class="activeTab === tab ? 'text-gold' : 'text-text-secondary hover:text-text-primary'"
            @click="setActiveTab(tab)"
          >
            {{ tab }}
          </button>
          <!-- Sliding indicator -->
          <div
            class="pointer-events-none absolute bottom-0 h-0.5 bg-gold shadow-[0_0_12px_rgba(201,168,76,0.35)] transition-all duration-300 ease-out"
            :style="{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }"
          />
        </div>
      </div>

      <!-- Records List -->
      <div class="mt-4 rounded-xl border border-border bg-bg-card">
        <div v-if="loading" class="px-4 py-12 text-center text-sm text-text-muted">加载中...</div>
        <div
          v-else-if="filteredRecords.length === 0"
          class="px-4 py-12 text-center text-sm text-text-muted"
        >
          暂无{{ activeTab === '全部' ? '消费记录' : activeTab }}
        </div>
        <div v-else class="divide-y divide-border">
          <div
            v-for="record in filteredRecords"
            :key="record.id"
            class="flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-bg-secondary"
            :class="{ 'cursor-pointer': record.orderId }"
            @click="record.orderId && goToOrder(record.orderId)"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                :class="getTypeConfig(record.type).bg"
              >
                <component
                  :is="getTypeConfig(record.type).icon"
                  class="h-4 w-4"
                  :class="getTypeConfig(record.type).color"
                />
              </div>
              <div>
                <p class="text-sm font-medium">{{ record.remark }}</p>
                <p class="text-xs text-text-muted">{{ record.createTime }}</p>
              </div>
            </div>
            <span
              class="text-sm font-medium shrink-0"
              :class="Number(record.amount) > 0 ? 'text-green-500' : 'text-red-500'"
            >
              {{ Number(record.amount) > 0 ? '+' : '' }}{{ Number(record.amount).toFixed(2) }} USDT
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
