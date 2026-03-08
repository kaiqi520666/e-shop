<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useReviewStore } from '@/stores/review'
import { formatPrice } from '@/utils'
import {
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Flame,
  Gift,
  Sparkles,
  Coins,
  Package,
  Cigarette,
  Wine,
  Wind,
  Star,
} from 'lucide-vue-next'

const categoryIcons = { Cigarette, Wine, Wind }

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const userStore = useUserStore()
const toast = inject('toast')

const currentBanner = ref(0)
let bannerTimer = null

onMounted(async () => {
  // 加载产品数据
  await Promise.all([
    productStore.fetchProducts(),
    productStore.fetchCategories(),
    productStore.fetchBanners(),
  ])

  // 启动 banner 轮播
  bannerTimer = setInterval(() => {
    if (productStore.banners.length > 1) {
      currentBanner.value = (currentBanner.value + 1) % productStore.banners.length
    }
  }, 4000)
})

onBeforeUnmount(() => {
  clearInterval(bannerTimer)
})

function goPrevBanner() {
  currentBanner.value =
    (currentBanner.value - 1 + productStore.banners.length) % productStore.banners.length
}

function goNextBanner() {
  currentBanner.value = (currentBanner.value + 1) % productStore.banners.length
}

function goToBannerLink(banner) {
  if (!banner?.link) return
  if (banner.link.startsWith('http')) {
    window.location.href = banner.link
  } else {
    router.push(banner.link)
  }
}

const hotProducts = computed(() => productStore.getHotProducts(6))
const newProducts = computed(() => productStore.getNewProducts(6))

function addToCart(product) {
  cartStore.addItem(product)
  toast.success('已加入购物车')
}

function goToInvite() {
  if (userStore.isLoggedIn) {
    router.push('/profile')
  } else {
    router.push({ path: '/login', query: { redirect: '/profile' } })
  }
}

const trustItems = [
  { icon: Coins, label: 'USDT 支付' },
  { icon: Package, label: '隐私发货' },
]
</script>

<template>
  <div class="pb-4">
    <!-- Banner -->
    <div
      class="relative h-56 overflow-hidden rounded-b-2xl sm:h-64 md:h-72 cursor-pointer"
      @click="goToBannerLink(productStore.banners[currentBanner])"
    >
      <transition-group name="banner">
        <img
          v-for="(banner, idx) in productStore.banners"
          v-show="currentBanner === idx"
          :key="banner.id"
          :src="banner.image"
          :alt="banner.title"
          class="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </transition-group>
      <!-- Double gradient overlay -->
      <div
        class="absolute inset-0 bg-linear-to-t from-bg-primary/90 via-transparent to-bg-primary/50"
      />
      <!-- Arrows -->
      <button
        type="button"
        class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-sm transition-colors duration-200 hover:bg-black/50 hover:text-white cursor-pointer"
        aria-label="上一张"
        @click.stop="goPrevBanner"
      >
        <ChevronLeft class="h-5 w-5" />
      </button>
      <button
        type="button"
        class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-sm transition-colors duration-200 hover:bg-black/50 hover:text-white cursor-pointer"
        aria-label="下一张"
        @click.stop="goNextBanner"
      >
        <ChevronRight class="h-5 w-5" />
      </button>
      <!-- Title & indicators -->
      <div class="absolute bottom-5 left-5 right-5">
        <p
          v-if="productStore.banners.length"
          class="font-heading text-xl font-bold text-white drop-shadow-lg"
        >
          {{ productStore.banners[currentBanner].title }}
        </p>
        <div class="mt-2 h-px w-12 bg-gold/70" aria-hidden="true" />
        <div class="mt-3 flex items-center gap-2">
        <button
          v-for="(_, idx) in productStore.banners"
          :key="idx"
          class="h-1 rounded-full transition-all duration-300 cursor-pointer"
          :class="currentBanner === idx ? 'w-8 bg-gold' : 'w-4 bg-white/40'"
          :aria-label="`切换到第${idx + 1}张横幅`"
          @click.stop="currentBanner = idx"
        />
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="px-4 py-5">
      <div class="grid grid-cols-3 gap-3">
        <router-link
          v-for="cat in productStore.categoryList"
          :key="cat.id"
          :to="`/category/${cat.id}`"
          class="group relative flex aspect-4/3 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-gold/20 bg-linear-to-br from-bg-card via-gold/5 to-transparent shadow-[0_0_20px_rgba(201,168,76,0.06)] transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,168,76,0.12)] cursor-pointer"
        >
          <div
            class="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-gold/10 transition-transform duration-300 group-hover:scale-150"
          />
          <div class="absolute -bottom-4 -left-4 h-14 w-14 rounded-full bg-gold/5" />
          <div
            class="absolute inset-0 bg-linear-to-t from-bg-primary/80 via-bg-primary/40 to-transparent"
          />
          <div
            class="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 shadow-[0_0_16px_rgba(201,168,76,0.2)] transition-transform duration-300 group-hover:scale-110"
          >
            <component :is="categoryIcons[cat.icon]" class="h-6 w-6 text-gold" aria-hidden="true" />
          </div>
          <span class="relative text-sm font-medium text-text-primary">{{ cat.name }}</span>
        </router-link>
      </div>
    </div>

    <!-- Invite / Member Entry -->
    <div class="px-4 pb-5">
      <button
        type="button"
        class="flex w-full items-center gap-4 rounded-xl border border-border bg-bg-card p-4 text-left transition-colors duration-200 hover:border-gold/30 cursor-pointer"
        @click="goToInvite"
      >
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10">
          <Gift class="h-6 w-6 text-gold" aria-hidden="true" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="font-medium text-text-primary">邀请好友</h3>
          <template v-if="userStore.isLoggedIn">
            <p class="mt-0.5 text-sm text-text-secondary">
              我的邀请码
              <code class="font-mono text-gold">{{ userStore.currentUser?.inviteCode }}</code> ·
              已邀请 {{ userStore.currentUser?.invitedCount ?? 0 }} 人
            </p>
            <p class="mt-1 text-xs text-text-muted">邀请好友注册，共享优惠奖励</p>
          </template>
          <template v-else>
            <p class="mt-0.5 text-sm text-text-secondary">登录后查看邀请码</p>
            <p class="mt-1 text-xs text-text-muted">注册即享会员权益，邀请好友共享优惠</p>
          </template>
        </div>
        <ChevronRight class="h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
      </button>
    </div>

    <!-- Hot Products -->
    <div class="px-4">
      <!-- Section Header -->
      <div class="mb-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 shadow-[0_0_12px_rgba(201,168,76,0.2)]"
          >
            <Flame class="h-5 w-5 text-gold" />
          </div>
          <h2
            class="font-heading text-lg font-bold bg-linear-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent"
          >
            热销推荐
          </h2>
        </div>
        <router-link
          to="/category"
          class="group flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-xs font-medium text-gold transition-all duration-200 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_16px_rgba(201,168,76,0.2)] cursor-pointer"
        >
          <span>查看全部</span>
          <ChevronRight
            class="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </router-link>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="product in hotProducts"
          :key="product.id"
          class="group overflow-hidden rounded-xl border border-border bg-bg-card transition-colors duration-200 hover:border-gold/30 cursor-pointer"
          @click="router.push(`/product/${product.id}`)"
        >
          <div class="relative aspect-4/3 overflow-hidden bg-bg-secondary">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              loading="lazy"
            />
            <div class="absolute top-2 left-2 flex flex-wrap gap-1">
              <span
                v-for="tag in product.tags.split(',')"
                :key="tag"
                class="rounded bg-gold/90 px-1.5 py-0.5 text-[10px] font-medium text-bg-primary"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="p-3">
            <h3 class="mb-1.5 truncate text-sm">{{ product.name }}</h3>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-base font-bold text-gold">{{ formatPrice(product.priceUSDT) }}</p>
                <p class="text-xs text-text-muted line-through">
                  {{ formatPrice(product.priceRMB, 'RMB') }}
                </p>
              </div>
              <button
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors duration-200 hover:bg-gold/20 cursor-pointer"
                aria-label="加入购物车"
                @click.stop="addToCart(product)"
              >
                <ShoppingCart class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Products -->
    <div v-if="newProducts.length" class="px-4 pt-6">
      <!-- Section Header -->
      <div class="mb-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 shadow-[0_0_12px_rgba(201,168,76,0.2)]"
          >
            <Sparkles class="h-5 w-5 text-gold" />
          </div>
          <h2
            class="font-heading text-lg font-bold bg-linear-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent"
          >
            新品上市
          </h2>
        </div>
        <router-link
          to="/category"
          class="group flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-xs font-medium text-gold transition-all duration-200 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_16px_rgba(201,168,76,0.2)] cursor-pointer"
        >
          <span>查看全部</span>
          <ChevronRight
            class="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </router-link>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="product in newProducts"
          :key="product.id"
          class="group overflow-hidden rounded-xl border border-border bg-bg-card transition-colors duration-200 hover:border-gold/30 cursor-pointer"
          @click="router.push(`/product/${product.id}`)"
        >
          <div class="relative aspect-4/3 overflow-hidden bg-bg-secondary">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              loading="lazy"
            />
            <div class="absolute top-2 left-2 flex flex-wrap gap-1">
              <span
                v-for="tag in product.tags.split(',')"
                :key="tag"
                class="rounded bg-gold/90 px-1.5 py-0.5 text-[10px] font-medium text-bg-primary"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="p-3">
            <h3 class="mb-1.5 truncate text-sm">{{ product.name }}</h3>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-base font-bold text-gold">{{ formatPrice(product.priceUSDT) }}</p>
                <p class="text-xs text-text-muted line-through">
                  {{ formatPrice(product.priceRMB, 'RMB') }}
                </p>
              </div>
              <button
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors duration-200 hover:bg-gold/20 cursor-pointer"
                aria-label="加入购物车"
                @click.stop="addToCart(product)"
              >
                <ShoppingCart class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brand Trust -->
    <div class="px-4 py-6">
      <!-- Section Title -->
      <div class="mb-5 flex items-center justify-center gap-3">
        <div class="h-px w-8 bg-linear-to-r from-transparent to-gold/50" />
        <h2
          class="font-heading text-lg font-bold bg-linear-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent"
        >
          品牌信任
        </h2>
        <div class="h-px w-8 bg-linear-to-l from-transparent to-gold/50" />
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="item in trustItems"
          :key="item.label"
          class="group relative overflow-hidden rounded-2xl border border-gold/20 bg-linear-to-br from-bg-card via-gold/5 to-transparent p-4 shadow-[0_0_20px_rgba(201,168,76,0.06)] transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,168,76,0.12)]"
        >
          <div
            class="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-gold/10 transition-transform duration-300 group-hover:scale-150"
          />
          <div class="absolute -bottom-3 -left-3 h-12 w-12 rounded-full bg-gold/5" />
          <div class="relative flex flex-col items-center gap-2">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 shadow-[0_0_12px_rgba(201,168,76,0.15)]"
            >
              <component :is="item.icon" class="h-5 w-5 text-gold" aria-hidden="true" />
            </div>
            <span class="text-center text-xs font-medium text-text-secondary">{{
              item.label
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition: opacity 0.6s ease;
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
}
</style>
