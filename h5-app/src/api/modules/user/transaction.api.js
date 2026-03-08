import request from '../../index'

export const transactionApi = {
  getList: (data) => request.post('/app/user/transaction/getList', data),
}
