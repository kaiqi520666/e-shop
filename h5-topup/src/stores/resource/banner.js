import { createCachedResourceStore } from '@/stores/helpers/createCachedResourceStore'
import { bannerApi } from '@/api/modules/topup/banner.api'

export const useBannerStore = createCachedResourceStore('banner', {
  dataKey: 'banners',
  fetcher: async () => {
    const res = await bannerApi.getBannerList({}, { silent: true, suppressErrorToast: true })
    return res.data || []
  },
})
