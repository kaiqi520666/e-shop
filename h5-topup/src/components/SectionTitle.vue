<template>
  <div class="flex items-center gap-3">
    <div
      class="w-1 h-5 rounded-full"
      :style="{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }"
    ></div>
    <h2 class="text-lg font-semibold text-white relative flex items-center gap-2">
      <component :is="icon" class="w-5 h-5" :style="{ color }" />
      <span class="relative z-10">{{ title }}</span>
      <span
        class="absolute inset-0 text-lg font-semibold opacity-50 blur-sm flex items-center gap-2"
        :style="{ color }"
      >
        <component :is="icon" class="w-5 h-5" />
        <span>{{ title }}</span>
      </span>
    </h2>
  </div>
  <AppDivider :color="color" />
</template>

<script setup>
import AppDivider from './AppDivider.vue'
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
  color: {
    type: String,
    default: '#00FFA3',
  },
})
</script>
