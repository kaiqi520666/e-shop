import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (userData.currentUser?.token) {
      config.headers.Authorization = `Bearer ${userData.currentUser.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 1000) {
      const error = new Error(res.message || '请求失败')
      error.isBusinessError = true
      // 显示全局 toast 错误提示
      window.$toast?.error(res.message || '请求失败')
      return Promise.reject(error)
    }
    return res
  },
  (error) => {
    const res = error.response?.data
    if (res) {
      window.$toast?.error(res.message || '网络错误')
      return Promise.reject(new Error(res.message || '网络错误'))
    }
    window.$toast?.error('网络错误')
    return Promise.reject(error)
  },
)

export default api
