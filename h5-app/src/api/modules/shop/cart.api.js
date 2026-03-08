import request from '../../index'

export const cartApi = {
  // 添加商品到购物车
  add: (data) => request.post('/app/shop/cart/add', data),

  // 更新购物车商品数量
  updateQuantity: (data) => request.post('/app/shop/cart/updateQuantity', data),

  // 移除购物车商品
  remove: (data) => request.post('/app/shop/cart/remove', data),

  // 清空购物车
  clear: () => request.post('/app/shop/cart/clear'),

  // 获取购物车列表
  list: () => request.post('/app/shop/cart/list'),
}
