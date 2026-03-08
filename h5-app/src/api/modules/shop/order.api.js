import request from '../../index'

export const orderApi = {
  createOrder: ({ phone, address, contact }) =>
    request.post('/app/shop/order/createOrder', { phone, address, contact }),
  getOrderList: (data) => request.post('/app/shop/order/getList', data),
  getOrderById: ({ id }) => request.post(`/app/shop/order/getDetail`, { id }),
}
