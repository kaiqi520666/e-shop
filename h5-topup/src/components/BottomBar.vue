<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-[#121212]/90 backdrop-blur-md border-t border-[#334155] z-50"
  >
    <div class="flex justify-around items-center h-16 max-w-lg mx-auto relative">
      <!-- 背景装饰 -->
      <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#00FFA3]/10 blur-2xl"></div>
      <div class="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-[#00FFA3]/5 blur-xl"></div>
      <!-- 激活指示线 -->
      <div
        v-for="(item, index) in navItems"
        :key="item.path"
        class="absolute top-0 h-0.5 transition-all duration-300"
        :class="isActive(item.path) ? 'bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]' : ''"
        :style="{
          left: `${(index / navItems.length) * 100}%`,
          width: `${100 / navItems.length}%`,
          opacity: isActive(item.path) ? 1 : 0,
        }"
      ></div>
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center w-full h-full transition-colors duration-200 relative z-10"
        :class="isActive(item.path) ? 'text-[#00FFA3]' : 'text-gray-400'"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-xs mt-1">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Home, Bell, FileText, User } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { path: '/', label: '充值', icon: Home },
  { path: '/notice', label: '公告', icon: Bell },
  { path: '/orders', label: '订单', icon: FileText },
  { path: '/profile', label: '我的', icon: User },
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
