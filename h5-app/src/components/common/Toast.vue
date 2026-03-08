<script setup>
import { CheckCircle, XCircle, Info } from 'lucide-vue-next'

defineProps({
  visible: Boolean,
  message: String,
  type: { type: String, default: 'info' },
})

const icons = { success: CheckCircle, error: XCircle, info: Info }
const colors = {
  success: 'bg-green-900/90 border-green-700 text-green-200',
  error: 'bg-red-900/90 border-red-700 text-red-200',
  info: 'bg-bg-secondary/90 border-border text-text-primary',
}
</script>

<template>
  <transition name="toast">
    <div
      v-if="visible"
      :role="type === 'error' ? 'alert' : 'status'"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
      class="fixed top-4 right-4 z-100 flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm"
      :class="colors[type]"
    >
      <component :is="icons[type]" class="h-5 w-5 shrink-0" />
      <span class="text-sm">{{ message }}</span>
    </div>
  </transition>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.25s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
