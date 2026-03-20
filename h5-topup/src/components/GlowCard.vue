<template>
  <div
    class="rounded-xl bg-linear-to-br from-[#1a1a2e] to-[#121212] backdrop-blur-md border border-[#334155] relative overflow-hidden"
    :class="padding"
  >
    <MatrixBackground />
    <div class="glow-deco-tr" :style="{ backgroundColor: `${color}1a` }"></div>
    <div class="glow-deco-bl" :style="{ backgroundColor: `${color}0d` }"></div>
    <div class="scan-line"></div>
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
import MatrixBackground from '@/components/MatrixBackground.vue'
defineProps({
  color: { type: String, default: '#00FFA3' },
  padding: { type: String, default: 'p-5' },
})
</script>
