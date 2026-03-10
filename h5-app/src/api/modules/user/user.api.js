import request from '../../index'

export const userApi = {
  login: (data) => request.post('/app/user/auth/login', data),
  register: (data) => request.post('/app/user/auth/register', data),
  refreshToken: (data) => request.post('/app/user/auth/refreshToken', data),
  getUserInfo: () => request.get('/app/user/info/person'),
  updateUserInfo: (data) => request.post('/app/user/info/updatePerson', data),
  recharge: (data) => request.post('/app/user/wallet/recharge', data),
  withdraw: (data) => request.post('/app/user/withdraw/apply', data),
  bindWallet: (data) => request.post('/app/user/wallet/bind', data),
  getTransactionRecord: (data) => request.post('/app/user/wallet/transactions', data),
  getCommissionRecord: (data) => request.post('/app/user/agent/commissions', data),
  getTeamMember: () => request.get('/app/user/agent/team'),
  setSubRate: (data) => request.post('/app/user/agent/setSubRate', data),
  getDefaultAddress: () => request.get('/app/user/address/default'),
  getAddressList: () => request.post('/app/user/address/list'),
  addAddress: (data) => request.post('/app/user/address/add', data),
  updateAddress: (data) => request.post('/app/user/address/update', data),
  deleteAddress: (ids) => request.post('/app/user/address/delete', { ids }),
  getAddressInfo: (id) => request.get(`/app/user/address/info?id=${id}`),
  getDirectTeamCount: () => request.get('/app/user/agent/directTeamCount'),
  getTeamCount: () => request.get('/app/user/agent/teamCount'),
}
