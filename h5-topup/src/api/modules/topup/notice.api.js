import api from '@/api'

export const noticeApi = {
  getNoticeList: (data, config) => api.post('/open/topup/notice/list', data, config),
  getNoticeDetail: (params, config) => api.get('/open/topup/notice/detail', { params, ...config }),
}
