import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { withdrawApi } from '@/api/modules/topup/withdraw.api'

export const useWithdrawStore = defineStore('withdraw', () => {
  const listLoading = ref(false)
  const submitting = ref(false)
  const lastError = ref('')
  const lastSubmittedAt = ref(null)

  const busy = computed(() => listLoading.value || submitting.value)

  async function getWithdrawList(data) {
    listLoading.value = true
    lastError.value = ''

    try {
      return await withdrawApi.getList(data)
    } catch (error) {
      lastError.value = error.message || '提现记录加载失败'
      throw error
    } finally {
      listLoading.value = false
    }
  }

  async function applyWithdraw(data, requestConfig) {
    submitting.value = true
    lastError.value = ''

    try {
      const res = await withdrawApi.apply(data, requestConfig)
      lastSubmittedAt.value = Date.now()
      return res
    } catch (error) {
      lastError.value = error.message || '提现申请失败'
      throw error
    } finally {
      submitting.value = false
    }
  }

  function resetState() {
    listLoading.value = false
    submitting.value = false
    lastError.value = ''
    lastSubmittedAt.value = null
  }

  return {
    listLoading,
    submitting,
    busy,
    lastError,
    lastSubmittedAt,
    getWithdrawList,
    applyWithdraw,
    resetState,
  }
})
