import api from '@/api'
export const transactionApi = {
  getList: (data) => api.post('/app/topup/transaction/getList', data),
}
