import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

export { useUserStore } from '@/stores/domain/user'
export { useOrderStore } from '@/stores/domain/order'
export { useRechargeStore } from '@/stores/domain/recharge'
export { useWithdrawStore } from '@/stores/domain/withdraw'
export { useTransactionStore } from '@/stores/domain/transaction'
export { useAppStore } from '@/stores/resource/app'
export { useBannerStore } from '@/stores/resource/banner'
export { useCategoryStore } from '@/stores/resource/category'
export { useNoticeStore } from '@/stores/resource/notice'
export { useToastStore } from '@/stores/ui/toast'
export { useLoadingStore } from '@/stores/ui/loading'
export { useConfirmStore } from '@/stores/ui/confirm'
export { resetAppStores } from '@/stores/reset'
