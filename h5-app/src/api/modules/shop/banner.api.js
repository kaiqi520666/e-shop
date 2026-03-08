import request from '../../index'

export const bannerApi = {
  getBannerList: (data) => request.get('/open/shop/banner/list', data),
}
