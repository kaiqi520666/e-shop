import api from '@/api'

export const rechargeApi = {
  apply: (data, config) => api.post('/app/topup/recharge/apply', data, config),
  checkStatus: (data, config) =>
    api.post('/app/topup/recharge/checkStatus', data, { silent: true, ...config }),
}
