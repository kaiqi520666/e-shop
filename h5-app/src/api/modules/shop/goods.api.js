import request from '../../index'

export const goodsApi = {
  getGoodsList: (data) => request.get('/open/shop/goods/list', data),
  getGoodsById: (id) => request.get(`/open/shop/goods/info?id=${id}`),
}
