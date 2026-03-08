<script setup>
import { ArrowLeft, ShoppingCart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: false },
  showCart: { type: Boolean, default: false },
})

const router = useRouter()
const cartStore = useCartStore()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-border bg-bg-primary/95 px-4 backdrop-blur-sm">
    <button
      v-if="showBack"
      class="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-bg-secondary hover:text-text-primary cursor-pointer"
      aria-label="返回"
      @click="goBack"
    >
      <ArrowLeft class="h-5 w-5" />
    </button>
    <div v-else class="w-8" />

    <h1 class="text-base font-medium truncate">{{ title }}</h1>

    <router-link
      v-if="showCart"
      to="/cart"
      class="relative flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-bg-secondary hover:text-text-primary cursor-pointer"
      aria-label="购物车"
    >
      <ShoppingCart class="h-5 w-5" />
      <span
        v-if="cartStore.itemCount > 0"
        class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-bg-primary"
      >
        {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
      </span>
    </router-link>
    <div v-else class="w-8" />
  </header>
</template>
