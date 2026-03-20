<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" :class="mb">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="emit('update:modelValue', tab.value)"
      class="tab-btn"
      :class="modelValue === tab.value ? 'tab-btn-active' : 'tab-btn-inactive'"
    >
      {{ tab.label }}
      <span v-if="tab.count != null" class="ml-1 text-xs opacity-70">({{ tab.count }})</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: [String, Number], required: true },
  mb: { type: String, default: 'mb-4' },
})
const emit = defineEmits(['update:modelValue'])
</script>
