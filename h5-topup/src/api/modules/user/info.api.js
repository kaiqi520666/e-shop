import api from '@/api'

export const infoApi = {
  getUserInfo: (config) => api.get('/app/user/info/person', config),
  updateUserInfo: (data) => api.post('/app/user/info/updatePerson', data),
  getTeamMember: () => api.get('/app/user/agent/team'),
  setSubRate: (data) => api.post('/app/user/agent/setSubRate', data),
}
