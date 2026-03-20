import api from '@/api'

export const categoryApi = {
  getCategoryList: (data) => api.post('/open/topup/category/list', data),
}
