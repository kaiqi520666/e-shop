import api from '@/api'

export const withdrawApi = {
  apply: (data, config) => api.post('/app/topup/withdraw/apply', data, config),
  getList: (data, config) => api.post('/app/topup/withdraw/list', data, config),
}
