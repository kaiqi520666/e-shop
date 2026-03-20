import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { rechargeApi } from '@/api/modules/topup/recharge.api'

export const useRechargeStore = defineStore('recharge', () => {
  const applying = ref(false)
  const checkingStatus = ref(false)
  const lastError = ref('')
  const lastAppliedAt = ref(null)
  const lastCheckedAt = ref(null)

  const busy = computed(() => applying.value || checkingStatus.value)

  async function apply(amount) {
    applying.value = true
    lastError.value = ''

    try {
      const res = await rechargeApi.apply({ amount })
      lastAppliedAt.value = Date.now()
      return res.data
    } catch (error) {
      lastError.value = error.message || '充值申请失败'
      throw error
    } finally {
      applying.value = false
    }
  }

  async function checkStatus(data) {
    checkingStatus.value = true
    lastError.value = ''

    try {
      const res = await rechargeApi.checkStatus(data)
      lastCheckedAt.value = Date.now()
      return res.data
    } catch (error) {
      lastError.value = error.message || '充值状态查询失败'
      throw error
    } finally {
      checkingStatus.value = false
    }
  }

  function resetState() {
    applying.value = false
    checkingStatus.value = false
    lastError.value = ''
    lastAppliedAt.value = null
    lastCheckedAt.value = null
  }

  return {
    applying,
    checkingStatus,
    busy,
    lastError,
    lastAppliedAt,
    lastCheckedAt,
    apply,
    checkStatus,
    resetState,
  }
})
