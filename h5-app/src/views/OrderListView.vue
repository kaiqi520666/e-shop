<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { formatPrice } from '@/utils'
import Header from '@/components/layout/Header.vue'
import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading.vue'
import { Package, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const orderStore = useOrderStore()

const statusTabs = [
  { value: '', label: '全部' },
  { value: 0, label: '待支付' },
  { value: 1, label: '已支付' },
  { value: 2, label: '已发货' },
  { value: 3, label: '已完成' },
]

const activeStatus = ref('')
const tabRefs = ref([])
const tabsContainerRef = ref(null)
const indicatorStyle = ref({ left: 0, width: 0 })

function updateIndicator() {
  nextTick(() => {
    const idx = statusTabs.findIndex((t) => t.value === activeStatus.value)
    if (idx < 0) return
    const tabEl = tabRefs.value[idx]
    const containerEl = tabsContainerRef.value
    if (tabEl && containerEl) {
      const tabRect = tabEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      indicatorStyle.value = {
        left: tabRect.left - containerRect.left + containerEl.scrollLeft,
        width: tabRect.width,
      }
    }
  })
}

onMounted(() => {
  orderStore.fetchOrders()
  updateIndicator()
  setTimeout(updateIndicator, 50)
})

const filteredOrders = computed(() => {
  const list = orderStore.orderList
  // 当 activeStatus 为空字符串时（表示"全部"），不过滤
  if (activeStatus.value === '') return list
  return list.filter((o) => o.status === activeStatus.value)
})

function setActiveStatus(value) {
  activeStatus.value = value
  updateIndicator()
}

const emptyStatusLabel = computed(() => {
  const tab = statusTabs.find((t) => t.value === activeStatus.value)
  return tab ? `暂无${tab.label}订单` : '暂无订单'
})

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function getItemCount(items) {
  if (!items || !Array.isArray(items)) return '查看详情'
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  return count > 0 ? `${count} 件商品` : '查看详情'
}
</script>

<template>
  <div>
    <Header title="我的订单" show-back />
    <Loading :visible="orderStore.loading" />

    <div class="sticky top-0 z-40 border-b border-border bg-bg-primary/95 backdrop-blur-sm">
      <div ref="tabsContainerRef" class="relative flex gap-4 overflow-x-auto px-4 pt-4 pb-3 scrollbar-hide">
        <button
          v-for="(tab, index) in statusTabs"
          :key="tab.value"
          :ref="(el) => { if (el) tabRefs[index] = el }"
          class="relative z-10 shrink-0 px-3 py-2 text-sm font-heading font-medium transition-colors duration-200 cursor-pointer"
          :class="activeStatus === tab.value
            ? 'text-gold'
            : 'text-text-secondary hover:text-text-primary'"
          @click="setActiveStatus(tab.value)"
        >
          {{ tab.label }}
        </button>
        <div
          class="pointer-events-none absolute bottom-0 h-0.5 bg-gold shadow-[0_0_12px_rgba(201,168,76,0.35)] transition-all duration-300 ease-out"
          :style="{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }"
        />
      </div>
    </div>

    <div v-if="filteredOrders.length" class="px-4 py-4 space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="rounded-xl border border-border bg-bg-card p-4 transition-colors duration-200 hover:border-gold/20 cursor-pointer"
        @click="router.push(`/orders/${order.id}`)"
      >
        <div class="mb-3 flex items-center justify-between">
          <span class="font-mono text-xs text-text-secondary">{{ order.orderNo }}</span>
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="{
              'bg-amber-500/20 text-amber-400': order.status === 0,
              'bg-blue-500/20 text-blue-400': order.status === 1,
              'bg-purple-500/20 text-purple-400': order.status === 2,
              'bg-green-500/20 text-green-400': order.status === 3,
              'bg-text-muted/20 text-text-muted': order.status === 4,
            }"
          >
            {{ orderStore.getStatusLabel(order.status) }}
          </span>
        </div>
        <div class="mb-2 flex items-center gap-2 text-sm text-text-secondary">
          <span>{{ formatDate(order.createTime) }}</span>
          <span>·</span>
          <span>{{ getItemCount(order.items) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-lg font-bold text-gold">{{ formatPrice(order.totalUSDT) }}</p>
          <ChevronRight class="h-4 w-4 text-text-muted" />
        </div>
      </div>
    </div>

    <Empty v-else :text="emptyStatusLabel" :icon="Package">
      <router-link
        to="/"
        class="mt-4 rounded-lg bg-gold px-6 py-2 text-sm text-bg-primary transition-colors duration-200 hover:bg-gold-light cursor-pointer"
      >
        去逛逛
      </router-link>
    </Empty>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
