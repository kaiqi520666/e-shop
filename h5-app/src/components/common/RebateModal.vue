<script setup>
import { ref, computed, watch } from 'vue'
import { X, Settings, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  visible: { type: Boolean, default: false },
  member: { type: Object, default: null },
  maxRebate: { type: Number, default: 0 },
})

const emit = defineEmits(['update:visible', 'confirm'])

const rebateValue = ref(0)
const errorMessage = ref('')

const minRebate = computed(() => Number(props.member?.commissionRate) || 0)
const maxValue = computed(() => Number(props.maxRebate) || 0)

watch(
  () => props.visible,
  (val) => {
    if (val && props.member) {
      rebateValue.value = Number(props.member.commissionRate) || 0
      errorMessage.value = ''
    }
  },
)

function close() {
  emit('update:visible', false)
}

function confirm() {
  errorMessage.value = ''

  if (rebateValue.value === minRebate.value) {
    errorMessage.value = '返点值未变化，请设置更高的返点'
    return
  }
  if (rebateValue.value < minRebate.value) {
    errorMessage.value = `返点不能低于下级当前返点 ${minRebate.value}%`
    return
  }
  if (rebateValue.value > maxValue.value) {
    errorMessage.value = `返点不能超过自身返点 ${maxValue.value}%`
    return
  }
  if (rebateValue.value < 0 || rebateValue.value > 100) {
    errorMessage.value = '返点值必须在 0-100% 之间'
    return
  }
  emit('confirm', { uid: props.member.id, rebate: rebateValue.value })
  close()
}

function handleBackdropClick(e) {
  if (e.target === e.currentTarget) close()
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <div class="mx-4 w-full max-w-sm rounded-xl bg-bg-card p-5 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Settings class="h-5 w-5 text-gold" />
              <h3 class="font-heading text-base font-medium">设置返点</h3>
            </div>
            <button type="button" class="text-text-muted hover:text-text-primary cursor-pointer" @click="close">
              <X class="h-5 w-5" />
            </button>
          </div>

          <div v-if="member" class="mb-5 rounded-lg bg-bg-secondary p-3">
            <p class="text-sm text-text-secondary">设置成员</p>
            <p class="font-medium">{{ member.username }}</p>
          </div>

          <div class="mb-5">
            <label class="mb-2 block text-sm text-text-secondary">
              返点比例 (返点差额 = {{ maxValue }}% - 下级返点)
            </label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="rebateValue"
                type="number"
                :min="minRebate"
                :max="maxValue"
                step="0.5"
                class="flex-1 rounded-lg border bg-bg-secondary px-3 py-2 text-center text-lg font-medium outline-none transition-colors duration-200"
                :class="errorMessage ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold'"
              />
              <span class="text-lg font-medium text-gold">%</span>
            </div>
            <p v-if="errorMessage" class="mt-2 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle class="h-3 w-3" />
              {{ errorMessage }}
            </p>
            <p v-else class="mt-2 text-xs text-text-muted">
              可设置范围：{{ minRebate }}% ~ {{ maxValue }}%
              <br />
              （返点只能增加不能减少）
            </p>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-lg border border-border bg-bg-secondary py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary cursor-pointer"
              @click="close"
            >
              取消
            </button>
            <button
              type="button"
              class="flex-1 rounded-lg bg-gold py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              @click="confirm"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
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
