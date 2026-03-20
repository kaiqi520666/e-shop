<template>
  <Transition name="page-skeleton-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-40 overflow-hidden bg-[#0e1316]"
      :class="{ 'pb-16': withBottomBar }"
    >
      <div class="h-full overflow-hidden p-4">
        <div class="mx-auto max-w-lg animate-pulse space-y-4">
          <div class="h-10 rounded-2xl bg-white/6"></div>
          <div class="h-40 rounded-3xl bg-white/7"></div>

          <div class="space-y-3 rounded-3xl border border-[#334155] bg-white/4 p-4">
            <div class="h-5 w-28 rounded-full bg-white/8"></div>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="item in 4"
                :key="item"
                class="h-24 rounded-2xl border border-[#334155] bg-white/5"
              ></div>
            </div>
          </div>

          <div
            v-for="item in 3"
            :key="`row-${item}`"
            class="rounded-2xl border border-[#334155] bg-white/4 p-4"
          >
            <div class="mb-3 flex items-center justify-between gap-4">
              <div class="h-5 w-24 rounded-full bg-white/8"></div>
              <div class="h-5 w-16 rounded-full bg-white/8"></div>
            </div>
            <div class="space-y-2">
              <div class="h-4 rounded-full bg-white/7"></div>
              <div class="h-4 w-5/6 rounded-full bg-white/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  withBottomBar: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.page-skeleton-fade-enter-active,
.page-skeleton-fade-leave-active {
  transition: opacity 0.18s ease;
}

.page-skeleton-fade-enter-from,
.page-skeleton-fade-leave-to {
  opacity: 0;
}
</style>
