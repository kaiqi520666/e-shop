<template>
  <div>
    <div class="mb-4 grid grid-cols-3 gap-3">
      <button
        v-for="amount in amounts"
        :key="amount"
        class="rounded-xl border bg-white/5 py-3 font-medium text-white transition-all"
        :class="
          selected === amount
            ? 'border-[#00FFA3] bg-[#00FFA3]/10'
            : 'border-[#334155] hover:border-white/30'
        "
        @click="selectQuick(amount)"
      >
        {{ prefix }}{{ amount }}
      </button>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-gray-400">自定义</span>
      <div class="relative flex-1">
        <input
          v-model="custom"
          type="number"
          placeholder="输入金额"
          class="input-field pr-16"
          @input="selected = null"
        />
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{{ suffix }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  amounts: { type: Array, required: true },
  modelValue: { type: Number, default: 0 },
  prefix: { type: String, default: '¥' },
  suffix: { type: String, default: 'CNY' },
  initialAmount: { type: Number, default: null },
})

const emit = defineEmits(['update:modelValue'])

const selected = ref(props.initialAmount ?? null)
const custom = ref('')

const finalAmount = computed(() => {
  if (selected.value) return selected.value
  if (custom.value) return parseFloat(custom.value) || 0
  return 0
})

watch(finalAmount, (val) => emit('update:modelValue', val), { immediate: true })

const selectQuick = (amount) => {
  selected.value = amount
  custom.value = ''
}
</script>
