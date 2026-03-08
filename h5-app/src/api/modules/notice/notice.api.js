import request from '../../index'

export const noticeApi = {
  // 获取公告列表
  getNoticeList: (data) => request.post('/open/notice/news/list', data),
  // 获取公告详情
  getNoticeById: (id) => request.get(`/open/notice/news/info?id=${id}`),
}
