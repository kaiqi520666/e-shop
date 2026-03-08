<script setup>
import { useRoute } from 'vue-router'
import { Home, LayoutGrid, ShoppingCart, User, Bell } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const navItems = [
  { to: '/', icon: Home, label: '首页', exact: true },
  { to: '/category', icon: LayoutGrid, label: '分类', exact: false },
  { to: '/notices', icon: Bell, label: '公告', exact: true },
  { to: '/cart', icon: ShoppingCart, label: '购物车', badge: true, exact: true },
  { to: '/profile', icon: User, label: '我的', exact: true },
]

function isNavActive(to, exact) {
  if (exact) return route.path === to
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/95 backdrop-blur-sm"
  >
    <div class="mx-auto flex max-w-md items-center justify-around md:max-w-lg lg:max-w-xl">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'relative flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors duration-200 cursor-pointer',
          isNavActive(item.to, item.exact ?? true) ? 'text-gold!' : 'text-text-muted',
        ]"
      >
        <span class="relative">
          <component :is="item.icon" class="h-5 w-5" />
          <span
            v-if="item.badge && cartStore.itemCount > 0"
            class="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-bg-primary"
          >
            {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
          </span>
        </span>
        <span class="text-[10px]">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>
