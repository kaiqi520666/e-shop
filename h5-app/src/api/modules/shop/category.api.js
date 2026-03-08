import request from '../../index'

export const categoryApi = {
  getCategoryList: (data) => request.get('/open/shop/category/list', data),
}
