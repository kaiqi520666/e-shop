<template>
  <div class="box-border flex h-dvh flex-col overflow-hidden overscroll-y-none p-4 pt-22">
    <PageHeader title="充值 USDT" />

    <div v-if="step === 1" class="flex flex-1 flex-col overflow-hidden overscroll-y-none">
      <GlowCard class="mb-6">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm text-gray-400">当前余额</span>
          <div
            class="flex items-center gap-1 rounded bg-[#00FFA3]/10 px-2 py-0.5 text-xs text-[#00FFA3]"
          >
            <Wallet class="h-3 w-3" />
            <span>USDT</span>
          </div>
        </div>
        <div class="mb-1 text-3xl font-bold text-white">
          {{ formattedBalance }}
          <span class="text-lg font-normal">USDT</span>
        </div>
        <div class="text-sm text-gray-500">≈ ￥{{ formattedCnyBalance }} CNY</div>
      </GlowCard>

      <div class="mb-6">
        <div class="mb-4 flex items-center gap-3">
          <div class="section-accent"></div>
          <span class="font-medium text-white">充值金额（CNY）</span>
        </div>
        <AmountSelector
          v-model="finalAmountValue"
          :amounts="quickAmounts"
          prefix="￥"
          suffix="CNY"
          :initial-amount="initialAmount"
        />
        <p v-if="amountError" class="mt-3 text-sm text-rose-400">{{ amountError }}</p>
      </div>

      <button
        :disabled="!canSubmitAmount"
        class="mt-auto w-full rounded-xl py-4 font-semibold"
        :class="
          canSubmitAmount
            ? 'bg-[#00FFA3] text-[#121212]'
            : 'cursor-not-allowed bg-white/10 text-gray-500'
        "
        @click="goToStep2"
      >
        {{ isSubmitting ? '创建中...' : '下一步' }}
      </button>
    </div>

    <div v-else class="flex-1 overflow-y-auto overscroll-y-none pb-2" style="touch-action: pan-y">
      <div class="mb-6 rounded-xl border border-[#334155] bg-white/5 p-5">
        <div class="mb-2 text-center text-sm text-gray-400">充值金额</div>
        <div class="mb-1 text-center text-4xl font-bold text-white">￥{{ formattedFinalAmount }}</div>
        <button
          class="mx-auto flex items-center gap-1 text-xl font-semibold text-[#00FFA3]"
          @click="copyUsdtAmount"
        >
          <span>≈ {{ formattedUsdtAmount }} USDT</span>
          <Copy class="h-4 w-4" />
        </button>
        <div class="mt-3 text-center text-xs text-gray-500">
          参考汇率：1 USDT ≈ ￥{{ formattedExchangeRate }}
        </div>
      </div>

      <div
        class="mb-6 rounded-xl border p-4 text-center"
        :class="
          isExpired
            ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            : 'border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]'
        "
      >
        <div>{{ countdownMessage }}</div>
        <div
          v-if="statusMessage"
          class="mt-2 text-sm"
          :class="isExpired ? 'text-rose-200' : 'text-gray-200'"
        >
          {{ statusMessage }}
        </div>
      </div>

      <div class="mb-6 rounded-xl border border-[#334155] bg-white/5 p-5">
        <div class="mb-4 flex items-center gap-3">
          <div class="section-accent"></div>
          <span class="font-medium text-white">充值地址</span>
        </div>
        <div
          class="mb-3 break-all rounded-lg border border-[#334155] bg-[#121212] p-3 font-mono text-sm text-white"
        >
          {{ rechargeAddress }}
        </div>
        <button
          class="w-full rounded-xl bg-[#00FFA3]/10 py-3 font-medium text-[#00FFA3]"
          @click="copyAddress"
        >
          复制地址
        </button>
      </div>

      <div class="mb-6 rounded-xl border border-[#334155] bg-[#121212]/80 p-4 text-sm text-gray-300">
        <div class="font-medium text-white">操作说明</div>
        <p class="mt-2">1. 请严格按页面展示的地址和金额完成转账。</p>
        <p class="mt-1">2. 转账后点击“我已转账”，系统会自动轮询订单状态。</p>
        <p class="mt-1">3. 如长时间未到账，请核对链上转账信息后再联系客服。</p>
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 rounded-xl bg-white/10 py-4 font-semibold text-white"
          @click="goBackToStep1"
        >
          上一步
        </button>
        <button
          :disabled="!canConfirm"
          class="flex-1 rounded-xl py-4 font-semibold transition"
          :class="
            canConfirm
              ? 'bg-[#00FFA3] text-[#121212]'
              : 'cursor-not-allowed bg-white/10 text-gray-500'
          "
          @click="confirmRecharge"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Wallet, Copy } from 'lucide-vue-next'
import { useAppStore, useRechargeStore, useUserStore } from '@/stores'
import { useUi } from '@/composables/useUi'
import { formatMoney, formatUsdt, toSafeNumber } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'
import GlowCard from '@/components/GlowCard.vue'
import AmountSelector from '@/components/AmountSelector.vue'
import { copyText } from '@/utils/clipboard'

const route = useRoute()
const userStore = useUserStore()
const rechargeStore = useRechargeStore()
const appStore = useAppStore()
const { toast, confirm } = useUi()

const step = ref(1)
const quickAmounts = [100, 500, 1000, 5000]
const finalAmountValue = ref(0)
const rechargeAddress = ref('')
const exchangeRate = ref(0)
const usdtAmount = ref(0)
const expirationTime = ref(0)
const tradeId = ref('')
const countdown = ref('')
const statusMessage = ref('')
const isSubmitting = ref(false)
const isCheckingStatus = ref(false)
const isConfirmingTransfer = ref(false)
const hasTransferred = ref(false)
const paidSuccess = ref(false)

let countdownTimer = null
let statusPollingTimer = null
let previousHtmlOverflow = ''
let previousBodyOverflow = ''
let previousBodyOverscrollBehavior = ''

const resolvedInitialAmount = toSafeNumber(route.query.amount, 0)
const initialAmount = resolvedInitialAmount > 0 ? resolvedInitialAmount : null
const finalAmountNumber = computed(() => toSafeNumber(finalAmountValue.value, 0))

const amountError = computed(() => {
  if (!finalAmountValue.value) {
    return ''
  }
  if (finalAmountNumber.value <= 0) {
    return '请输入大于 0 的充值金额'
  }
  if (!exchangeRate.value) {
    return '当前汇率不可用，请稍后重试'
  }
  return ''
})

const canSubmitAmount = computed(
  () => finalAmountNumber.value > 0 && !amountError.value && !isSubmitting.value,
)

const isExpired = computed(
  () => expirationTime.value > 0 && expirationTime.value <= Math.floor(Date.now() / 1000),
)

const canConfirm = computed(() => {
  return (
    !!tradeId.value &&
    !!rechargeAddress.value &&
    !isExpired.value &&
    !isCheckingStatus.value &&
    !isConfirmingTransfer.value &&
    !paidSuccess.value
  )
})

const formattedBalance = computed(() => formatUsdt(userStore.currentUser?.balance, 2))
const formattedCnyBalance = computed(() =>
  formatMoney(toSafeNumber(userStore.currentUser?.balance) * exchangeRate.value),
)
const formattedFinalAmount = computed(() => formatMoney(finalAmountNumber.value))
const formattedUsdtAmount = computed(() => formatUsdt(usdtAmount.value))
const formattedExchangeRate = computed(() => formatMoney(exchangeRate.value))

const countdownMessage = computed(() => {
  if (isExpired.value) {
    return '当前充值订单已过期，请返回上一步重新发起。'
  }

  if (countdown.value) {
    return `请在 ${countdown.value} 内完成支付`
  }

  return '订单已创建，请尽快完成转账。'
})

const confirmButtonText = computed(() => {
  if (paidSuccess.value) {
    return '已到账'
  }
  if (isExpired.value) {
    return '订单已过期'
  }
  if (isConfirmingTransfer.value) {
    return '确认中...'
  }
  if (isCheckingStatus.value) {
    return '查询中...'
  }
  return hasTransferred.value ? '继续查询状态' : '我已转账'
})

const clearCountdownTimer = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

const clearStatusPolling = () => {
  if (statusPollingTimer) {
    clearInterval(statusPollingTimer)
    statusPollingTimer = null
  }
}

const resetTradeState = () => {
  clearCountdownTimer()
  clearStatusPolling()
  rechargeAddress.value = ''
  usdtAmount.value = 0
  expirationTime.value = 0
  tradeId.value = ''
  countdown.value = ''
  statusMessage.value = ''
  isCheckingStatus.value = false
  isConfirmingTransfer.value = false
  hasTransferred.value = false
  paidSuccess.value = false
}

const updateCountdown = () => {
  if (!expirationTime.value) {
    countdown.value = ''
    return
  }

  const remaining = expirationTime.value - Math.floor(Date.now() / 1000)
  if (remaining <= 0) {
    countdown.value = '已过期'
    statusMessage.value = hasTransferred.value
      ? '订单已超时，无法继续确认到账。'
      : '订单已超时，请重新发起充值。'
    clearCountdownTimer()
    clearStatusPolling()
    return
  }

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  countdown.value = `${minutes}:${String(seconds).padStart(2, '0')}`
}

const normalizeTradeStatus = (payload) => {
  return toSafeNumber(payload?.status ?? payload?.orderStatus ?? payload?.data?.status, 0)
}

const refreshBalanceAfterSuccess = async () => {
  try {
    await userStore.getUserInfo({ silent: true, suppressErrorToast: true })
    toast.success('充值成功，余额已刷新')
  } catch {
    statusMessage.value = '支付成功，但余额刷新失败，请稍后在个人中心查看最新余额。'
    toast.warning('充值成功，但余额刷新失败，请稍后手动刷新')
  }
}

const handleTradeStatus = async (status, showPendingToast = false) => {
  if (status === 2) {
    clearStatusPolling()
    clearCountdownTimer()
    paidSuccess.value = true
    statusMessage.value = '支付成功，正在刷新余额。'
    await refreshBalanceAfterSuccess()
    return
  }

  if (status === 3) {
    clearStatusPolling()
    expirationTime.value = Math.floor(Date.now() / 1000) - 1
    updateCountdown()
    toast.warning('订单已超时，请重新发起充值')
    return
  }

  statusMessage.value = '已提交转账确认，系统正在轮询链上状态，请稍候。'
  if (showPendingToast) {
    toast.info('已开始查询订单状态，请稍候')
  }
}

const pollRechargeStatus = async (showPendingToast = false) => {
  if (!tradeId.value || isCheckingStatus.value || isExpired.value || paidSuccess.value) {
    return false
  }

  isCheckingStatus.value = true
  try {
    const payload = await rechargeStore.checkStatus(
      { tradeId: tradeId.value },
      { suppressErrorToast: true },
    )
    const status = normalizeTradeStatus(payload)
    await handleTradeStatus(status, showPendingToast)
    return true
  } catch {
    statusMessage.value = showPendingToast
      ? '状态查询失败，请稍后手动重试。'
      : '自动查询失败，系统会继续重试。'
    if (showPendingToast) {
      toast.error('订单状态查询失败，请稍后点击继续查询')
    }
    return false
  } finally {
    isCheckingStatus.value = false
  }
}

const startStatusPolling = async () => {
  clearStatusPolling()
  await pollRechargeStatus(true)

  if (isExpired.value || paidSuccess.value) {
    return
  }

  statusPollingTimer = setInterval(() => {
    void pollRechargeStatus(false)
  }, 5000)
}

const goToStep2 = async () => {
  if (amountError.value) {
    toast.warning(amountError.value)
    return
  }

  const confirmed = await confirm.open({
    type: 'warning',
    title: '确认创建充值订单',
    message: `充值金额：￥${formattedFinalAmount.value}\n参考汇率：1 USDT ≈ ￥${formattedExchangeRate.value}\n确认后将生成本次充值地址和订单。`,
    confirmText: '确认创建',
    cancelText: '再检查一下',
  })

  if (!confirmed || isSubmitting.value) {
    return
  }

  resetTradeState()
  isSubmitting.value = true

  try {
    const payload = await rechargeStore.apply(finalAmountNumber.value, {
      suppressErrorToast: true,
    })
    rechargeAddress.value = payload?.token || payload?.address || ''
    expirationTime.value = toSafeNumber(payload?.expirationTime, 0)
    usdtAmount.value = toSafeNumber(payload?.actualAmount, 0)
    tradeId.value = payload?.tradeId || ''

    if (!rechargeAddress.value || !tradeId.value || !usdtAmount.value) {
      resetTradeState()
      toast.error('充值订单创建成功，但返回信息不完整，请重新发起')
      return
    }

    step.value = 2
    updateCountdown()
    if (!isExpired.value) {
      countdownTimer = setInterval(updateCountdown, 1000)
    }
  } catch (error) {
    toast.error(error.message || '充值订单创建失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

const goBackToStep1 = () => {
  resetTradeState()
  step.value = 1
}

const copyAddress = async () => {
  if (!rechargeAddress.value) {
    return
  }

  const copied = await copyText(rechargeAddress.value)
  if (copied) {
    toast.success('充值地址已复制')
  } else {
    toast.error('复制失败，请手动长按地址复制')
  }
}

const copyUsdtAmount = async () => {
  if (!usdtAmount.value) {
    return
  }

  const copied = await copyText(formattedUsdtAmount.value)
  if (copied) {
    toast.success('USDT 金额已复制')
  } else {
    toast.error('复制失败，请手动长按金额复制')
  }
}

const confirmRecharge = async () => {
  if (isExpired.value) {
    toast.warning('当前订单已过期，请返回上一步重新发起')
    return
  }

  if (!tradeId.value || !rechargeAddress.value || !usdtAmount.value) {
    toast.warning('订单信息不完整，请返回上一步重新发起')
    return
  }

  if (isConfirmingTransfer.value) {
    return
  }

  isConfirmingTransfer.value = true

  try {
    const confirmed = await confirm.open({
      type: 'warning',
      title: '确认已转账',
      message: `充值地址：${rechargeAddress.value}\n转账金额：${formattedUsdtAmount.value} USDT\n请确认你已按上方信息完成转账。`,
      confirmText: '我已确认转账',
      cancelText: '再核对一下',
    })

    if (!confirmed) {
      return
    }

    hasTransferred.value = true
    statusMessage.value = '已提交转账确认，系统正在轮询链上状态，请稍候。'
    await startStatusPolling()
  } finally {
    isConfirmingTransfer.value = false
  }
}

onMounted(async () => {
  previousHtmlOverflow = document.documentElement.style.overflow
  previousBodyOverflow = document.body.style.overflow
  previousBodyOverscrollBehavior = document.body.style.overscrollBehavior
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  document.body.style.overscrollBehavior = 'none'

  await appStore.load()
  exchangeRate.value = toSafeNumber(appStore.getConfigValue('usdt_rate'), 0)
})

onUnmounted(() => {
  clearCountdownTimer()
  clearStatusPolling()
  document.documentElement.style.overflow = previousHtmlOverflow
  document.body.style.overflow = previousBodyOverflow
  document.body.style.overscrollBehavior = previousBodyOverscrollBehavior
})
</script>
