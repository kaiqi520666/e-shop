<template>
  <div class="fixed left-0 right-0 top-0 z-50 bg-[#0e1316] px-4 pt-4">
    <div class="flex items-center gap-3">
      <button
        v-if="showBack"
        @click="goBack"
        class="rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/10"
      >
        <ArrowLeft class="h-5 w-5 text-white" />
      </button>
      <h1 class="flex-1 text-xl font-semibold text-white">{{ title }}</h1>
      <slot name="right"></slot>
    </div>
    <AppDivider :color="dividerColor" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppDivider from './AppDivider.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  dividerColor: {
    type: String,
    default: '#00FFA3',
  },
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
