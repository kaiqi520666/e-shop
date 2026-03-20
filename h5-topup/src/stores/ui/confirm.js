import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const show = ref(false)
  const type = ref('danger')
  const title = ref('')
  const message = ref('')
  const confirmText = ref('确认')
  const cancelText = ref('取消')
  let resolveConfirm = null

  function open(options = {}) {
    type.value = options.type ?? 'danger'
    title.value = options.title ?? '确认操作'
    message.value = options.message ?? ''
    confirmText.value = options.confirmText ?? '确认'
    cancelText.value = options.cancelText ?? '取消'
    show.value = true

    return new Promise((resolve) => {
      resolveConfirm = resolve
    })
  }

  function confirm() {
    show.value = false
    resolveConfirm?.(true)
    resolveConfirm = null
  }

  function cancel() {
    show.value = false
    resolveConfirm?.(false)
    resolveConfirm = null
  }

  return { show, type, title, message, confirmText, cancelText, open, confirm, cancel }
})
