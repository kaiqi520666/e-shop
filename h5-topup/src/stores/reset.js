import { useAppStore } from '@/stores/resource/app'
import { useCategoryStore } from '@/stores/resource/category'
import { useNoticeStore } from '@/stores/resource/notice'
import { useOrderStore } from '@/stores/domain/order'
import { useRechargeStore } from '@/stores/domain/recharge'
import { useTransactionStore } from '@/stores/domain/transaction'
import { useUserStore } from '@/stores/domain/user'
import { useWithdrawStore } from '@/stores/domain/withdraw'
import { useLoadingStore } from '@/stores/ui/loading'

export function resetAppStores(pinia) {
  useUserStore(pinia).logout()
  useOrderStore(pinia).clear()
  useAppStore(pinia).clear()
  useCategoryStore(pinia).clear()
  useNoticeStore(pinia).reset()
  useRechargeStore(pinia).resetState()
  useWithdrawStore(pinia).resetState()
  useTransactionStore(pinia).resetState()
  useLoadingStore(pinia).reset()
}
