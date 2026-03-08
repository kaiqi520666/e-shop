import request from '../../index'

export const reviewApi = {
  getReviewList: (goodsId) => request.get(`/open/shop/review/list?goodsId=${goodsId}`),
  getReviewSummary: (goodsId) => request.get(`/open/shop/review/summary?goodsId=${goodsId}`),
}
