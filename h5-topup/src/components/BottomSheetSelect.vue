<!-- components/BottomSheetSelect.vue -->
<template>
  <!-- 触发区域 -->
  <div @click="open = true" class="input-field flex items-center justify-between cursor-pointer">
    <span :class="modelValue ? 'text-white' : 'text-gray-500'">
      {{ modelValue || placeholder }}
    </span>
    <ChevronDown
      class="w-4 h-4 text-gray-400 transition-transform duration-300"
      :class="{ 'rotate-180': open }"
    />
  </div>

  <!-- 遮罩 + 弹出层 -->
  <Teleport to="body">
    <Transition name="mask">
      <div
        v-if="open"
        class="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        @click="open = false"
      />
    </Transition>

    <Transition name="sheet">
      <!-- 弹出层 -->
      <div
        v-if="open"
        class="fixed bottom-0 left-0 right-0 z-50 bg-[#0e1316] rounded-t-2xl border-t border-[#2a2a2a] max-h-[60vh] flex flex-col"
      >
        <!-- 顶部把手 + 标题 -->
        <div class="flex flex-col items-center pt-3 pb-2 border-b border-[#2a2a2a] shrink-0">
          <div class="w-10 h-1 rounded-full bg-[#3a3a3a] mb-3"></div>
          <span class="text-white font-medium text-sm">{{ title }}</span>
        </div>

        <!-- 选项列表 -->
        <div class="overflow-y-auto overscroll-contain">
          <div
            v-for="option in options"
            :key="option"
            @click="select(option)"
            class="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a] active:bg-white/5 transition-colors cursor-pointer"
            :class="option === modelValue ? 'text-[#00ffa3]' : 'text-gray-200'"
          >
            <span>{{ option }}</span>
            <Check v-if="option === modelValue" class="w-4 h-4 text-[#00ffa3]" />
          </div>
        </div>

        <div class="shrink-0 pb-6 flex items-center justify-center border-t border-[#2a2a2a] pt-3">
          <button @click="open = false" class="text-gray-400 text-sm">取消</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

defineProps({
  modelValue: String,
  options: Array,
  placeholder: { type: String, default: '请选择' },
  title: { type: String, default: '请选择' },
})

const emit = defineEmits(['update:modelValue'])
const open = ref(false)

const select = (val) => {
  emit('update:modelValue', val)
  open.value = false
}
</script>

<style scoped>
.mask-enter-active,
.mask-leave-active {
  transition: opacity 0.25s ease;
}
.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
