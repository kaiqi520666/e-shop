<script setup>
defineProps({
  noPadding: { type: Boolean, default: false },
})
</script>

<template>
  <main :class="['min-h-dvh', noPadding ? '' : 'px-4 py-4']">
    <slot />
  </main>
</template>
