import { createCachedResourceStore } from '@/stores/helpers/createCachedResourceStore'
import { configApi } from '@/api'

export const useAppStore = createCachedResourceStore('app', {
  dataKey: 'configList',
  fetcher: async () => {
    const res = await configApi.getConfigList()
    return res.data
  },
  getters: ({ configList }) => ({
    getConfigValue(configKey) {
      const config = configList.value.find((item) => item.cKey === configKey)
      return config ? config.cValue : null
    },
  }),
})
