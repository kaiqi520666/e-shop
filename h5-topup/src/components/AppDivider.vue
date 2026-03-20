<template>
  <div class="h-px my-4" :style="gradientStyle"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#00FFA3',
  },
})

const gradientStyle = computed(() => ({
  background: `linear-gradient(90deg, transparent, ${props.color}, transparent)`,
}))
</script>
