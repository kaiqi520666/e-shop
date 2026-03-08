<script setup>
import { PackageOpen } from 'lucide-vue-next'

defineProps({
  text: { type: String, default: '暂无数据' },
  icon: { type: [Object, Function], default: () => PackageOpen },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-text-muted">
    <component :is="icon" class="mb-4 h-16 w-16 opacity-40" />
    <p class="text-sm">{{ text }}</p>
    <slot />
  </div>
</template>
