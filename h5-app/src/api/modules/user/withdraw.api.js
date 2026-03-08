import request from '../../index'

export const withdrawApi = {
  apply: (data) => request.post('/app/user/withdraw/apply', data),
  getList: (data) => request.post('/app/user/withdraw/list', data),
}
