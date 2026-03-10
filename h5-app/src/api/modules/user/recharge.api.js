import request from '../../index'

export const rechargeApi = {
  apply: (data) => request.post('/app/user/recharge/apply', data),
  getList: (data) => request.post('/app/user/recharge/list', data),
  check: (tradeId) => request.get(`/app/user/recharge/check/${tradeId}`),
}
