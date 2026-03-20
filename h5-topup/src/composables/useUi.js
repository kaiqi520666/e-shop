import { getConfirm, getLoading, getToast } from '@/services/ui'

export function useUi() {
  return {
    toast: getToast(),
    loading: getLoading(),
    confirm: getConfirm(),
  }
}
