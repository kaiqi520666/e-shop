<template>
  <div class="flex flex-col items-center justify-center" :class="py">
    <component v-if="icon" :is="icon" class="mb-4 h-16 w-16 text-gray-600" />
    <p class="text-gray-500">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '暂无数据' },
  icon: { type: [Object, Function], default: null },
  py: { type: String, default: 'py-12' },
})
</script>
