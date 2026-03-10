import request from '../../index'

export const configApi = {
  list: () => request.post('/open/app/config/list'),
}
