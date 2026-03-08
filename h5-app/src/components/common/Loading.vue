<script setup>
import { Loader2 } from 'lucide-vue-next'

defineProps({
  visible: Boolean,
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-90 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <Loader2 class="h-10 w-10 animate-spin text-gold" />
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
