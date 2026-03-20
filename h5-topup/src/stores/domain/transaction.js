import { ref } from 'vue'
import { defineStore } from 'pinia'
import { transactionApi } from '@/api'

export const useTransactionStore = defineStore('transaction', () => {
  const listLoading = ref(false)
  const lastError = ref('')

  async function getList(data) {
    listLoading.value = true
    lastError.value = ''

    try {
      return await transactionApi.getList(data)
    } catch (error) {
      lastError.value = error.message || '记录加载失败'
      throw error
    } finally {
      listLoading.value = false
    }
  }

  function resetState() {
    listLoading.value = false
    lastError.value = ''
  }

  return {
    listLoading,
    lastError,
    getList,
    resetState,
  }
})
