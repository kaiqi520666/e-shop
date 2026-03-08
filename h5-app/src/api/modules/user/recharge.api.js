import request from '../../index'

export const rechargeApi = {
  apply: (data) => request.post('/app/user/recharge/apply', data),
  getList: (data) => request.post('/app/user/recharge/list', data),
}
