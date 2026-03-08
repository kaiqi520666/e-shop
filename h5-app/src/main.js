import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import '@/assets/main.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersistedstate)
app.use(pinia)
app.use(router)

const toastState = ref({ visible: false, message: '', type: 'info' })
let toastTimer = null

const toast = {
  show(message, type = 'info') {
    clearTimeout(toastTimer)
    toastState.value = { visible: true, message, type }
    toastTimer = setTimeout(() => {
      toastState.value.visible = false
    }, 2000)
  },
  success(message) {
    this.show(message, 'success')
  },
  error(message) {
    this.show(message, 'error')
  },
  info(message) {
    this.show(message, 'info')
  },
}

// 保存 toast 引用到 window，供 axios 拦截器使用
window.$toast = toast

app.provide('toast', toast)
app.provide('toastState', toastState)

app.mount('#app')
