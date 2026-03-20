import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    count: 0,
    pageLoading: false,
  }),
  getters: {
    isLoading: (state) => state.count > 0,
  },
  actions: {
    show() {
      this.count += 1
    },
    hide() {
      this.count = Math.max(0, this.count - 1)
    },
    showPage() {
      this.pageLoading = true
    },
    hidePage() {
      this.pageLoading = false
    },
    reset() {
      this.count = 0
      this.pageLoading = false
    },
  },
})
