import api from '@/api'

export const orderApi = {
  createOrder: (data, config) => api.post('/app/topup/order/createOrder', data, config),
  getDetail: (data, config) => api.post('/app/topup/order/getDetail', data, config),
  getList: (data, config) => api.post('/app/topup/order/getList', data, config),
  cancelOrder: (data, config) => api.post('/app/topup/order/cancelOrder', data, config),
  cumulative: (data, config) => api.post('/app/topup/order/cumulative', data, config),
}
