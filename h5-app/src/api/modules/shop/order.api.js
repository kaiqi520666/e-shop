import request from '../../index'

export const orderApi = {
  createOrder: ({ phone, address, contact, payType }) =>
    request.post('/app/shop/order/createOrder', { phone, address, contact, payType }),
  getOrderList: (data) => request.post('/app/shop/order/getList', data),
  getOrderById: ({ id }) => request.post(`/app/shop/order/getDetail`, { id }),
  // 查询订单支付状态（USDT扫码支付后轮询用）
  getOrderPayStatus: ({ orderId }) => request.post('/app/shop/order/getPayStatus', { id: orderId }),
}
