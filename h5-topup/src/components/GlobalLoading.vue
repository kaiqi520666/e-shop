<!-- components/GlobalLoading.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="loading.isLoading"
        class="fixed inset-0 z-9999 flex items-center justify-center bg-black/40"
      >
        <div
          class="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"
        />
      </div> </Transition
  ></Teleport>
</template>

<script setup>
import { useLoadingStore } from '@/stores'
const loading = useLoadingStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
