<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { formatPrice } from '@/utils'
import Header from '@/components/layout/Header.vue'
import Loading from '@/components/common/Loading.vue'
import { MapPin } from 'lucide-vue-next'

const route = useRoute()
const orderStore = useOrderStore()

const order = ref(null)

onMounted(async () => {
  order.value = await orderStore.fetchOrderById(route.params.id)
})

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div>
    <Header title="订单详情" show-back />
    <Loading :visible="orderStore.loading" />

    <div v-if="order" class="px-4 py-4 space-y-4">
      <div class="rounded-xl border border-border bg-bg-card p-4">
        <div class="mb-3 flex items-center justify-between">
          <span class="font-mono text-sm text-text-secondary">{{ order.orderNo }}</span>
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
        <p class="text-xs text-text-muted">{{ formatDate(order.createTime) }}</p>
      </div>

      <div class="rounded-xl border border-border bg-bg-card overflow-hidden">
        <div class="border-b border-border px-4 py-3">
          <h3 class="text-sm font-medium text-text-secondary">商品清单</h3>
        </div>
        <div class="divide-y divide-border">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex gap-3 p-4"
          >
            <div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bg-secondary">
              <img
                :src="item.productImage"
                :alt="item.productName"
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="flex min-w-0 flex-1 flex-col justify-between">
              <p class="truncate text-sm font-medium">{{ item.productName }}</p>
              <div class="flex items-end justify-between">
                <p class="text-xs text-text-muted">x{{ item.quantity }}</p>
                <p class="text-sm font-bold text-gold">{{ formatPrice(item.subtotalUSDT) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-bg-card p-4">
        <div class="flex items-start gap-2">
          <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div>
            <p class="text-sm font-medium text-text-secondary">收货地址</p>
            <p class="mt-1 text-sm text-text-primary">{{ order.address }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-bg-card p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-text-secondary">订单总额</span>
          <span class="text-xl font-bold text-gold">{{ formatPrice(order.totalUSDT) }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="!orderStore.loading" class="px-4 py-16 text-center text-sm text-text-muted">
      订单不存在
    </div>
  </div>
</template>
