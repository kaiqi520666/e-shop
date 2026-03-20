import axios from 'axios'
import { pinia, useUserStore } from '@/stores'
import { getLoading, getToast } from '@/services/ui'
import { handleUnauthorized } from '@/services/session'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

const shouldShowErrorToast = (config) => !config?.suppressErrorToast

api.interceptors.request.use((config) => {
  const userStore = useUserStore(pinia)
  const token = userStore.currentUser?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (!config.silent) {
    getLoading().show()
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    const { config, data } = response

    if (!config.silent) {
      getLoading().hide()
    }

    if (data.code === 1000) {
      return data
    }

    if (data.code === 401) {
      if (shouldShowErrorToast(config)) {
        getToast().warning(data.message || '登录状态已失效，请重新登录')
      }
      handleUnauthorized()
      return Promise.reject(new Error(data.message || 'Unauthorized'))
    }

    if (shouldShowErrorToast(config)) {
      getToast().error(data.message || '请求失败，请稍后重试')
    }
    return Promise.reject(new Error(data.message || 'Request failed'))
  },
  (error) => {
    if (!error.config?.silent) {
      getLoading().hide()
    }

    if (error.response?.status === 401) {
      if (shouldShowErrorToast(error.config)) {
        getToast().warning(error.response?.data?.message || '登录状态已失效，请重新登录')
      }
      handleUnauthorized()
      return Promise.reject(new Error(error.response?.data?.message || 'Unauthorized'))
    }

    if (error.code === 'ECONNABORTED') {
      if (shouldShowErrorToast(error.config)) {
        getToast().error('请求超时，请稍后重试')
      }
      return Promise.reject(new Error('Request timeout'))
    }

    const message =
      error.response?.data?.message || error.message || '网络异常，请检查连接后重试'

    if (shouldShowErrorToast(error.config)) {
      getToast().error(message)
    }
    return Promise.reject(new Error(message))
  },
)

export { authApi } from './modules/user/auth.api'
export { infoApi } from './modules/user/info.api'
export { categoryApi } from './modules/topup/category.api'
export { bannerApi } from './modules/topup/banner.api'
export { noticeApi } from './modules/topup/notice.api'
export { configApi } from './modules/app/config.api'
export { orderApi } from './modules/topup/order.api'
export { transactionApi } from './modules/topup/transaction.api'
export default api
