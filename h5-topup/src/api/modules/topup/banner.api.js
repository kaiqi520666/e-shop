import api from '@/api'

export const bannerApi = {
  getBannerList: (data, config) => api.post('/open/topup/banner/list', data, config),
}
