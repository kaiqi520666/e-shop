<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import { useReviewStore } from '@/stores/review'
import { useUserStore } from '@/stores/user'
import { orderApi } from '@/api/modules/shop/order.api'
import { formatPrice } from '@/utils'
import { walletAddress } from '@/mock/data'
import {
  CheckCircle,
  Home,
  Star,
  MessageSquare,
  Copy,
  QrCode,
  Clock,
  RefreshCw,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const appStore = useAppStore()
const reviewStore = useReviewStore()
const userStore = useUserStore()

// 初始化加载配置
appStore.fetchConfigList()

const orderNo = route.query.orderNo || '—'
const total = route.query.total || '0.00'
const address = route.query.address || '—'
const orderId = route.query.orderId || null
const amountCNY = route.query.amountCNY || null
const payType = Number(route.query.payType || 1)
const orderStatus = Number(route.query.status || 0)
const expirationTime = Number(route.query.expirationTime || 0)

// 倒计时相关
const countdown = ref('')
let countdownTimer = null

// 格式化倒计时显示
function updateCountdown() {
  if (!expirationTime || localStatus.value !== 0) {
    countdown.value = ''
    return
  }

  const now = Math.floor(Date.now() / 1000)
  const remaining = expirationTime - now

  if (remaining <= 0) {
    // 超时了
    countdown.value = '00:00:00'
    localStatus.value = 4 // 标记为超时
    stopCountdown()
    return
  }

  const hours = Math.floor(remaining / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60

  countdown.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function startCountdown() {
  if (countdownTimer) return
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 轮询订单状态
const polling = ref(false)
const localStatus = ref(orderStatus)
let pollingTimer = null

// 是否是 USDT 扫码支付
const isUSDTPayment = computed(() => payType === 2)

// 轮询查询订单状态
async function pollOrderStatus() {
  if (!orderId || localStatus.value === 1 || localStatus.value === 4 || polling.value) return

  polling.value = true
  try {
    const res = await orderApi.getOrderPayStatus({ orderId: Number(orderId) })
    if (res.code === 1000 && res.data) {
      localStatus.value = res.data.status
      // 支付成功 (status = 1)
      if (localStatus.value === 1) {
        stopPolling()
        // 更新用户信息
        await userStore.fetchUserInfo()
      }
      // 超时 (status = 4)
      if (localStatus.value === 4) {
        stopPolling()
      }
    }
  } catch (e) {
    console.error('轮询订单状态失败:', e)
  } finally {
    polling.value = false
  }
}

function startPolling() {
  if (pollingTimer) return
  pollingTimer = setInterval(() => {
    pollOrderStatus()
  }, 3000) // 每3秒轮询一次
}

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

onMounted(() => {
  if (isUSDTPayment.value && localStatus.value === 0) {
    startCountdown()
    startPolling()
  }
})

onUnmounted(() => {
  stopPolling()
  stopCountdown()
})

function getPriceUSDT(product) {
  return appStore.usdt_rate ? product.priceRMB / appStore.usdt_rate : 0
}

// 复制钱包地址
function copyWallet() {
  navigator.clipboard
    .writeText(walletAddress)
    .then(() => {
      window.$toast?.success('钱包地址已复制')
    })
    .catch(() => {
      window.$toast?.info('请手动复制地址')
    })
}

// 二维码链接
const qrUrl = computed(
  () => `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${walletAddress}`,
)

// 获取订单状态文本
const orderStatusText = computed(() => {
  if (localStatus.value === 0) return '等待支付'
  if (localStatus.value === 1) return '支付成功'
  if (localStatus.value === 4) return '支付超时'
  return '未知状态'
})

// 获取订单状态颜色
const orderStatusClass = computed(() => {
  if (localStatus.value === 0) return 'text-orange-400'
  if (localStatus.value === 1) return 'text-green-400'
  if (localStatus.value === 4) return 'text-red-400'
  return 'text-text-muted'
})

// 获取热门好评商品推荐（评分最高的前3个）
const topRatedProducts = computed(() => {
  return productStore.productList
    .filter((p) => {
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
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full"
          :class="isUSDTPayment && localStatus === 0 ? 'bg-orange-900/30' : 'bg-green-900/30'"
        >
          <CheckCircle
            class="h-10 w-10"
            :class="isUSDTPayment && localStatus === 0 ? 'text-orange-400' : 'text-green-400'"
          />
        </div>
      </div>

      <!-- 余额支付：直接成功 -->
      <template v-if="!isUSDTPayment">
        <h1 class="mb-2 font-heading text-2xl font-bold">下单成功</h1>
        <p class="mb-8 text-sm text-text-secondary">您的订单已创建成功</p>

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
      </template>

      <!-- USDT扫码支付：显示支付信息 -->
      <template v-else>
        <h1 class="mb-2 font-heading text-2xl font-bold">订单已创建</h1>
        <p class="mb-4 text-sm text-text-secondary">请在倒计时结束前完成 USDT 转账</p>

        <!-- 支付状态 -->
        <div class="mb-4 flex items-center justify-center gap-2">
          <Clock class="h-4 w-4" :class="orderStatusClass" />
          <span class="text-sm font-medium" :class="orderStatusClass">{{ orderStatusText }}</span>
          <span v-if="countdown && localStatus === 0" class="text-sm font-mono text-orange-400">
            ({{ countdown }})
          </span>
          <RefreshCw v-if="localStatus === 0" class="h-3 w-3 animate-spin text-text-muted" />
        </div>

        <!-- 支付信息卡片 -->
        <div class="mb-6 rounded-xl border border-border bg-bg-card p-5 text-left">
          <div class="mb-3 flex justify-between text-sm">
            <span class="text-text-secondary">订单编号</span>
            <span class="font-mono text-xs">{{ orderNo }}</span>
          </div>
          <div class="mb-3 flex justify-between text-sm">
            <span class="text-text-secondary">应付金额</span>
            <span class="font-bold text-gold">{{ total }} USDT</span>
          </div>
          <div v-if="amountCNY" class="mb-3 flex justify-between text-sm">
            <span class="text-text-secondary">人民币</span>
            <span class="font-bold text-gold">¥{{ amountCNY }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="shrink-0 text-text-secondary">收货地址</span>
            <span class="ml-4 text-right text-xs text-text-secondary">{{ address }}</span>
          </div>
        </div>

        <!-- USDT支付收款信息 -->
        <div
          v-if="localStatus === 0"
          class="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4"
        >
          <p class="mb-3 text-xs text-orange-400">请向以下地址转账 {{ total }} USDT (TRC20)</p>

          <!-- 二维码 -->
          <div class="mb-4 flex justify-center">
            <img
              :src="qrUrl"
              alt="USDT TRC20 收款二维码"
              class="h-40 w-40 rounded-lg bg-white p-2"
              loading="lazy"
            />
          </div>

          <!-- 地址 -->
          <div class="flex items-center gap-2 rounded-lg bg-bg-secondary p-3">
            <QrCode class="h-4 w-4 shrink-0 text-gold" />
            <code class="flex-1 truncate text-xs text-text-secondary">{{ walletAddress }}</code>
            <button
              type="button"
              class="shrink-0 text-xs text-gold transition-colors hover:text-gold-light cursor-pointer"
              @click="copyWallet"
            >
              <Copy class="h-4 w-4" />
            </button>
          </div>

          <p class="mt-3 text-xs text-text-muted">当前USDT支付区块网络协议为TRC20</p>
        </div>

        <!-- 超时提示 -->
        <div
          v-if="localStatus === 4"
          class="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4"
        >
          <p class="text-sm text-red-400">支付超时，订单已取消</p>
          <p class="mt-1 text-xs text-text-muted">如有疑问请联系客服</p>
        </div>
      </template>

      <!-- Review Guidance Banner -->
      <div
        v-if="!isUSDTPayment"
        class="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-left"
      >
        <div class="mb-2 flex items-center gap-2">
          <MessageSquare class="h-4 w-4 text-gold" />
          <span class="text-sm font-medium text-gold">收到商品后记得评价哦</span>
        </div>
        <p class="text-xs text-text-secondary">
          分享您的购买体验，帮助更多买家做决策，也让我们不断改进！
        </p>
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
            <img
              :src="product.image"
              :alt="product.name"
              class="h-12 w-12 rounded-lg object-cover shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="truncate text-sm">{{ product.name }}</p>
              <div class="mt-0.5 flex items-center gap-1">
                <Star class="h-3 w-3 fill-gold text-gold" />
                <span class="text-xs text-gold font-medium">{{
                  Number(reviewStore.getSummary(product.id)?.avgRating).toFixed(1)
                }}</span>
                <span class="text-xs text-text-muted"
                  >· {{ reviewStore.getSummary(product.id)?.total }} 条评价</span
                >
              </div>
            </div>
            <span class="shrink-0 text-sm font-bold text-gold">{{
              formatPrice(getPriceUSDT(product))
            }}</span>
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
