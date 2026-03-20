import request from '@/api'

export const authApi = {
  login: (data) => request.post('/app/user/auth/login', data),
  register: (data) => request.post('/app/user/auth/register', data),
  refreshToken: (data) => request.post('/app/user/auth/refreshToken', data),
}
