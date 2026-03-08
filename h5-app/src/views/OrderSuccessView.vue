<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useReviewStore } from '@/stores/review'
import { formatPrice } from '@/utils'
import { CheckCircle, Home, Star, MessageSquare } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const reviewStore = useReviewStore()

const orderNo = route.query.orderNo || '—'
const total = route.query.total || '0.00'
const address = route.query.address || '—'

// 获取热门好评商品推荐（评分最高的前3个）
const topRatedProducts = computed(() => {
  return productStore.productList
    .filter(p => {
      const s = reviewStore.getSummary(p.id)
      return s && s.total > 0 && s.avgRating >= 4.5
    })
    .slice(0, 3)
})
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
    <div class="w-full max-w-sm text-center">
      <div class="mb-6 flex justify-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-900/30">
          <CheckCircle class="h-10 w-10 text-green-400" />
        </div>
      </div>

      <h1 class="mb-2 font-heading text-2xl font-bold">下单成功</h1>
      <p class="mb-8 text-sm text-text-secondary">请尽快完成 USDT 转账支付</p>

      <div class="mb-6 rounded-xl border border-border bg-bg-card p-5 text-left">
        <div class="mb-3 flex justify-between text-sm">
          <span class="text-text-secondary">订单编号</span>
          <span class="font-mono text-xs">{{ orderNo }}</span>
        </div>
        <div class="mb-3 flex justify-between text-sm">
          <span class="text-text-secondary">应付金额</span>
          <span class="font-bold text-gold">{{ total }} USDT</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="shrink-0 text-text-secondary">收货地址</span>
          <span class="ml-4 text-right text-xs text-text-secondary">{{ address }}</span>
        </div>
      </div>

      <!-- Review Guidance Banner -->
      <div class="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-left">
        <div class="mb-2 flex items-center gap-2">
          <MessageSquare class="h-4 w-4 text-gold" />
          <span class="text-sm font-medium text-gold">收到商品后记得评价哦</span>
        </div>
        <p class="text-xs text-text-secondary">分享您的购买体验，帮助更多买家做决策，也让我们不断改进！</p>
        <button
          class="mt-3 rounded-lg border border-gold/50 px-4 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-gold/10 cursor-pointer"
          @click="router.push('/orders')"
        >
          前往订单页面评价
        </button>
      </div>

      <!-- Top Rated Products Recommendation -->
      <div v-if="topRatedProducts.length" class="mb-6 text-left">
        <h3 class="mb-3 flex items-center gap-1.5 text-sm font-semibold text-text-primary">
          <Star class="h-4 w-4 fill-gold text-gold" />
          好评热销商品推荐
        </h3>
        <div class="space-y-2">
          <div
            v-for="product in topRatedProducts"
            :key="product.id"
            class="flex items-center gap-3 rounded-xl border border-border bg-bg-card p-3 cursor-pointer hover:border-gold/30 transition-colors"
            @click="router.push(`/product/${product.id}`)"
          >
            <img :src="product.image" :alt="product.name" class="h-12 w-12 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="truncate text-sm">{{ product.name }}</p>
              <div class="mt-0.5 flex items-center gap-1">
                <Star class="h-3 w-3 fill-gold text-gold" />
                <span class="text-xs text-gold font-medium">{{ Number(reviewStore.getSummary(product.id)?.avgRating).toFixed(1) }}</span>
                <span class="text-xs text-text-muted">· {{ reviewStore.getSummary(product.id)?.total }} 条评价</span>
              </div>
            </div>
            <span class="shrink-0 text-sm font-bold text-gold">{{ formatPrice(product.priceUSDT) }}</span>
          </div>
        </div>
      </div>

      <button
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-medium text-bg-primary transition-colors duration-200 hover:bg-gold-light cursor-pointer"
        @click="router.replace('/')"
      >
        <Home class="h-4 w-4" />
        返回首页
      </button>
    </div>
  </div>
</template>
