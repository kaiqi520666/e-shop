import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  pinia,
  resetAppStores,
  useConfirmStore,
  useLoadingStore,
  useToastStore,
} from '@/stores'
import { initUiServices } from '@/services/ui'
import { buildLoginLocation, initSessionHandlers, isPublicPath } from '@/services/session'

const app = createApp(App)

app.use(pinia)

const toastStore = useToastStore(pinia)
const loadingStore = useLoadingStore(pinia)
const confirmStore = useConfirmStore(pinia)

initUiServices({
  toast: toastStore,
  loading: loadingStore,
  confirm: confirmStore,
})

initSessionHandlers({
  onUnauthorized: async () => {
    const currentRoute = router.currentRoute.value
    resetAppStores(pinia)

    if (currentRoute.path !== '/login') {
      if (isPublicPath(currentRoute.path)) {
        await router.replace('/login')
      } else {
        await router.replace(buildLoginLocation(currentRoute.fullPath))
      }
    }
  },
})

app.use(router)
app.mount('#app')
