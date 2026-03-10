import { defineStore } from 'pinia'
import { ref } from 'vue'
import { configApi } from '@/api/modules/app/config.app.js'
export const useAppStore = defineStore(
  'app',
  () => {
    const configList = ref([])
    const loading = ref(false)
    const platform_wallet = ref('')
    const usdt_rate = ref(0)
    const min_recharge = ref(0)
    const min_withdraw = ref(0)

    async function fetchConfigList() {
      loading.value = true
      try {
        const res = await configApi.list()
        configList.value = res.data
        platform_wallet.value = res.data.find((item) => item.cKey === 'platform_wallet')?.cValue || ''
        usdt_rate.value = Number(res.data.find((item) => item.cKey === 'usdt_rate')?.cValue) || 0
        min_recharge.value = Number(res.data.find((item) => item.cKey === 'min_recharge')?.cValue) || 0
        min_withdraw.value = Number(res.data.find((item) => item.cKey === 'min_withdraw')?.cValue) || 0
      } catch (error) {
        console.error('获取配置列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      configList,
      loading,
      fetchConfigList,
      platform_wallet,
      usdt_rate,
      min_recharge,
      min_withdraw,
    }
  },
  {
    persist: true,
  },
)
