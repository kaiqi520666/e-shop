import { defineStore } from 'pinia'

const TITLES = {
  success: '操作成功',
  error: '请求失败',
  warning: '请注意',
  info: '提示',
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
    timerId: null,
  }),
  actions: {
    open(message, type = 'success', title, duration = 3000) {
      if (this.timerId) {
        clearTimeout(this.timerId)
      }

      this.type = type
      this.title = title ?? TITLES[type]
      this.message = message
      this.duration = duration
      this.show = true
      this.timerId = setTimeout(() => this.close(), duration)
    },
    close() {
      this.show = false

      if (this.timerId) {
        clearTimeout(this.timerId)
        this.timerId = null
      }
    },
    success(message, title) {
      this.open(message, 'success', title)
    },
    error(message, title) {
      this.open(message, 'error', title)
    },
    warning(message, title) {
      this.open(message, 'warning', title)
    },
    info(message, title) {
      this.open(message, 'info', title)
    },
  },
})
