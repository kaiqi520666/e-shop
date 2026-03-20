import api from '@/api'

export const configApi = {
  getConfigList: (data) => api.post('/open/app/config/list', data),
}
