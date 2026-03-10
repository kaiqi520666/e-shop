<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useReviewStore } from '@/stores/review'
import { formatPrice } from '@/utils'
import Header from '@/components/layout/Header.vue'
import {
  ShoppingCart,
  Minus,
  Plus,
  Package,
  Zap,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  ChevronDown,
  X,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const userStore = useUserStore()
const appStore = useAppStore()
const reviewStore = useReviewStore()
const toast = inject('toast')

const product = ref(null)
const quantity = ref(1)

function getPriceUSDT(product) {
  return appStore.usdt_rate ? product.priceRMB / appStore.usdt_rate : 0
}

// 图片轮播相关
const currentImageIndex = ref(0)

const allImages = ref([])

const hasMultipleImages = ref(false)

// 自动轮播
let autoSlideTimer = null
const AUTO_SLIDE_INTERVAL = 3000 // 3秒

function startAutoSlide() {
  if (autoSlideTimer) clearInterval(autoSlideTimer)
  if (allImages.value.length > 1) {
    autoSlideTimer = setInterval(() => {
      nextImage()
    }, AUTO_SLIDE_INTERVAL)
  }
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

// 评价相关
const productId = computed(() => route.params.id)
const reviews = computed(() => reviewStore.getReviews(productId.value))
const reviewSummary = ref(null)
const positiveRate = ref(0)
const showAllReviews = ref(false)
const displayedReviews = computed(() =>
  showAllReviews.value ? reviews.value : reviews.value.slice(0, 2),
)

// 提交评价弹窗
const showReviewModal = ref(false)
const reviewForm = ref({ rating: 5, content: '' })

function openReviewModal() {
  if (!userStore.isLoggedIn) {
    return router.push({ name: 'login', query: { redirect: route.fullPath } })
  }
  reviewForm.value = { rating: 5, content: '' }
  showReviewModal.value = true
}

async function submitReview() {
  if (!reviewForm.value.content.trim()) {
    return toast.error('请填写评价内容')
  }
  const result = await reviewStore.submitReview({
    productId: productId.value,
    userId: userStore.currentUser?.uid,
    username: userStore.currentUser?.username,
    rating: reviewForm.value.rating,
    content: reviewForm.value.content,
    images: [],
  })
  if (result.success) {
    showReviewModal.value = false
    toast.success('评价提交成功，感谢您的反馈！')
  } else {
    toast.error('提交失败，请重试')
  }
}

onMounted(async () => {
  appStore.fetchConfigList()

  product.value = await productStore.getById(route.params.id)
  allImages.value = [product.value.image, ...product.value.images]
  hasMultipleImages.value = allImages.value.length > 1

  startAutoSlide()

  // 加载评价数据
  await Promise.all([
    reviewStore.fetchReviews(productId.value),
    reviewStore.fetchSummary(productId.value),
  ])
  reviewSummary.value = reviewStore.getSummary(productId.value)
  positiveRate.value = reviewStore.getPositiveRate(productId.value)
})

onUnmounted(() => {
  stopAutoSlide()
})

function prevImage() {
  if (!hasMultipleImages.value) return
  currentImageIndex.value =
    currentImageIndex.value === 0 ? allImages.value.length - 1 : currentImageIndex.value - 1
  startAutoSlide() // 用户手动操作时重置定时器
}

function nextImage() {
  if (!hasMultipleImages.value) return
  currentImageIndex.value =
    currentImageIndex.value === allImages.value.length - 1 ? 0 : currentImageIndex.value + 1
  startAutoSlide() // 用户手动操作时重置定时器
}

function goToImage(index) {
  currentImageIndex.value = index
  startAutoSlide() // 用户手动操作时重置定时器
}

function decrease() {
  if (quantity.value > 1) quantity.value--
}

function increase() {
  if (product.value && quantity.value < product.value.stock) quantity.value++
}

function addToCart() {
  if (!product.value) return
  if (!userStore.isLoggedIn) {
    return router.push({ name: 'login', query: { redirect: route.fullPath } })
  }
  cartStore.addItem(product.value, quantity.value)
  toast.success('已加入购物车')
}

function buyNow() {
  if (!product.value) return
  if (!userStore.isLoggedIn) {
    return router.push({ name: 'login', query: { redirect: route.fullPath } })
  }
  cartStore.addItem(product.value, quantity.value)
  router.push('/checkout')
}
</script>

<template>
  <div v-if="product" class="pb-24">
    <Header title="商品详情" show-back show-cart />

    <!-- Product Image Carousel -->
    <div class="relative aspect-4/3 w-full overflow-hidden bg-bg-secondary">
      <div
        class="flex h-full w-full transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
      >
        <img
          v-for="(img, index) in allImages"
          :key="index"
          :src="img"
          :alt="`${product.name} ${index + 1}`"
          class="h-full w-full shrink-0 object-cover"
        />
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="hasMultipleImages"
        class="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 cursor-pointer"
        @click="prevImage"
      >
        <ChevronLeft class="h-5 w-5" />
      </button>
      <button
        v-if="hasMultipleImages"
        class="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 cursor-pointer"
        @click="nextImage"
      >
        <ChevronRight class="h-5 w-5" />
      </button>

      <!-- Dots Indicator -->
      <div
        v-if="hasMultipleImages"
        class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
      >
        <button
          v-for="(_, index) in allImages"
          :key="index"
          type="button"
          class="h-2 w-2 rounded-full transition-colors cursor-pointer"
          :class="index === currentImageIndex ? 'bg-gold' : 'bg-white/50'"
          @click="goToImage(index)"
        />
      </div>
    </div>

    <!-- Product Info -->
    <div class="px-4 py-5">
      <div class="mb-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in product.tags.split(',')"
          :key="tag"
          class="rounded bg-gold/10 px-2 py-0.5 text-[11px] text-gold"
        >
          {{ tag }}
        </span>
      </div>

      <h1 class="mb-3 text-xl font-medium">{{ product.name }}</h1>

      <div class="mb-4 flex items-baseline gap-3">
        <span class="text-2xl font-bold text-gold">{{ formatPrice(getPriceUSDT(product)) }}</span>
        <span class="text-sm text-text-muted">{{ formatPrice(product.priceRMB, 'RMB') }}</span>
      </div>

      <div class="mb-5 flex items-center gap-2 text-sm text-text-secondary">
        <Package class="h-4 w-4" />
        <span>库存 {{ product.stock }} 件</span>
      </div>

      <div class="mb-6 rounded-xl border border-border bg-bg-card p-4">
        <p class="text-sm leading-relaxed text-text-secondary">{{ product.description }}</p>
      </div>

      <!-- Reviews Section -->
      <div class="mb-6">
        <!-- Summary Header -->
        <div class="mb-3 flex items-center justify-between">
          <h2 class="flex items-center gap-1.5 text-base font-semibold">
            <MessageSquare class="h-4 w-4 text-gold" />
            商品评价
            <span v-if="reviewSummary?.total" class="text-sm font-normal text-text-muted"
              >({{ reviewSummary.total }})</span
            >
          </h2>
          <button class="text-xs text-gold hover:underline cursor-pointer" @click="openReviewModal">
            写评价
          </button>
        </div>

        <!-- Rating Summary Card -->
        <div
          v-if="reviewSummary && reviewSummary.total > 0"
          class="mb-4 rounded-xl border border-border bg-bg-card p-4"
        >
          <div class="flex items-center gap-4">
            <div class="flex flex-col items-center">
              <span class="text-3xl font-bold text-gold">{{
                Number(reviewSummary.avgRating).toFixed(1)
              }}</span>
              <div class="mt-1 flex gap-0.5">
                <Star
                  v-for="i in 5"
                  :key="i"
                  class="h-3.5 w-3.5"
                  :class="
                    i <= Math.round(reviewSummary.avgRating)
                      ? 'text-gold fill-gold'
                      : 'text-border fill-border'
                  "
                />
              </div>
              <span class="mt-1 text-xs text-text-muted">好评率 {{ positiveRate }}%</span>
            </div>
            <div class="flex flex-1 flex-col gap-1">
              <div
                v-for="(count, index) in [
                  reviewSummary.fiveStarCount,
                  reviewSummary.fourStarCount,
                  reviewSummary.threeStarCount,
                ]"
                :key="index"
                class="flex items-center gap-2"
              >
                <span class="w-8 text-right text-xs text-text-muted">{{ 5 - index }}星</span>
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    class="h-full rounded-full bg-gold transition-all duration-500"
                    :style="{
                      width: reviewSummary.total ? `${(count / reviewSummary.total) * 100}%` : '0%',
                    }"
                  />
                </div>
                <span class="w-4 text-xs text-text-muted">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- No reviews state -->
        <div
          v-else-if="!reviewStore.loading"
          class="rounded-xl border border-border bg-bg-card p-6 text-center"
        >
          <MessageSquare class="mx-auto mb-2 h-8 w-8 text-text-muted" />
          <p class="text-sm text-text-muted">暂无评价，快来抢先评价吧</p>
          <button
            class="mt-3 rounded-lg border border-gold px-4 py-1.5 text-xs text-gold hover:bg-gold/10 cursor-pointer"
            @click="openReviewModal"
          >
            写评价
          </button>
        </div>

        <!-- Review List -->
        <div v-if="displayedReviews.length" class="space-y-3">
          <div
            v-for="review in displayedReviews"
            :key="review.id"
            class="rounded-xl border border-border bg-bg-card p-4"
          >
            <div class="mb-2 flex items-center gap-2">
              <!-- 头像：有头像显示头像，没有则显示首字母 -->
              <div v-if="review.avatar" class="h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <img
                  :src="review.avatar"
                  :alt="review.username"
                  class="h-full w-full object-cover"
                />
              </div>
              <div
                v-else
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-medium text-gold"
              >
                {{ review.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ review.username }}</p>
                <div class="flex gap-0.5">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    class="h-3 w-3"
                    :class="i <= review.rating ? 'text-gold fill-gold' : 'text-border fill-border'"
                  />
                </div>
              </div>
              <span class="shrink-0 text-xs text-text-muted">{{ review.createTime }}</span>
            </div>
            <p class="text-sm leading-relaxed text-text-secondary">{{ review.content }}</p>
            <div v-if="review.images?.length" class="mt-2 flex gap-2 overflow-x-auto">
              <img
                v-for="(img, idx) in review.images"
                :key="idx"
                :src="img"
                class="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Show More -->
        <button
          v-if="reviews.length > 2 && !showAllReviews"
          class="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-sm text-text-secondary transition-colors hover:border-gold/30 hover:text-gold cursor-pointer"
          @click="showAllReviews = true"
        >
          查看全部 {{ reviews.length }} 条评价
          <ChevronDown class="h-4 w-4" />
        </button>
      </div>

      <!-- Quantity Selector -->
      <div class="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4">
        <span class="text-sm text-text-secondary">购买数量</span>
        <div class="flex items-center gap-3">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors duration-200 hover:border-gold/30 hover:text-text-primary disabled:opacity-30 cursor-pointer"
            :disabled="quantity <= 1"
            @click="decrease"
            aria-label="减少数量"
          >
            <Minus class="h-4 w-4" />
          </button>
          <span class="w-8 text-center font-medium">{{ quantity }}</span>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors duration-200 hover:border-gold/30 hover:text-text-primary disabled:opacity-30 cursor-pointer"
            :disabled="quantity >= product.stock"
            @click="increase"
            aria-label="增加数量"
          >
            <Plus class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div
      class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/95 backdrop-blur-sm"
    >
      <div class="mx-auto flex max-w-md gap-3 px-4 py-3 md:max-w-lg lg:max-w-xl">
        <button
          class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold py-3 text-sm font-medium text-gold transition-colors duration-200 hover:bg-gold/10 cursor-pointer"
          @click="addToCart"
        >
          <ShoppingCart class="h-4 w-4" />
          加入购物车
        </button>
        <button
          class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-medium text-bg-primary transition-colors duration-200 hover:bg-gold-light cursor-pointer"
          @click="buyNow"
        >
          <Zap class="h-4 w-4" />
          立即购买
        </button>
      </div>
    </div>

    <!-- Review Modal -->
    <Teleport to="body">
      <div
        v-if="showReviewModal"
        class="fixed inset-0 z-100 flex items-end justify-center bg-black/60 backdrop-blur-sm"
        @click.self="showReviewModal = false"
      >
        <div class="w-full max-w-md rounded-t-2xl bg-bg-card p-5">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-base font-semibold">写评价</h3>
            <button
              class="text-text-muted hover:text-text-primary cursor-pointer"
              @click="showReviewModal = false"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Star Rating -->
          <div class="mb-4">
            <p class="mb-2 text-sm text-text-secondary">评分</p>
            <div class="flex gap-2">
              <button v-for="i in 5" :key="i" class="cursor-pointer" @click="reviewForm.rating = i">
                <Star
                  class="h-7 w-7 transition-colors"
                  :class="i <= reviewForm.rating ? 'text-gold fill-gold' : 'text-border'"
                />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-4">
            <p class="mb-2 text-sm text-text-secondary">评价内容</p>
            <textarea
              v-model="reviewForm.content"
              placeholder="分享您的使用体验，帮助更多买家做决策..."
              rows="4"
              class="w-full resize-none rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
            />
          </div>

          <button
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-medium text-bg-primary transition-colors hover:bg-gold-light cursor-pointer disabled:opacity-50"
            :disabled="reviewStore.submitting"
            @click="submitReview"
          >
            {{ reviewStore.submitting ? '提交中...' : '提交评价' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>

  <div v-else class="flex min-h-dvh items-center justify-center">
    <p class="text-text-muted">商品加载中...</p>
  </div>
</template>
