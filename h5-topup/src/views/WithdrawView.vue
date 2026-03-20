<template>
  <div class="p-4 pt-22">
    <PageHeader title="提现" />

    <GlowCard class="mb-6">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm text-gray-400">可提现余额</span>
        <div class="flex items-center gap-1 rounded bg-[#00FFA3]/10 px-2 py-0.5 text-xs text-[#00FFA3]">
          <Wallet class="h-3 w-3" />
          <span>TRC-20</span>
        </div>
      </div>
      <div class="mb-1 text-3xl font-bold text-white">
        {{ balanceDisplay }} <span class="text-lg font-normal">USDT</span>
      </div>
      <div class="text-sm text-gray-500">≈ ￥{{ cnyBalance }} CNY</div>
    </GlowCard>

    <div class="mb-6">
      <div class="mb-4 flex items-center gap-3">
        <div class="section-accent"></div>
        <span class="font-medium text-white">提现金额</span>
      </div>
      <AmountSelector v-model="finalAmountValue" :amounts="quickAmounts" suffix="USDT" />
      <p v-if="amountError" class="mt-3 text-sm text-rose-400">{{ amountError }}</p>
    </div>

    <div class="mb-6">
      <div class="mb-4 flex items-center gap-3">
        <div class="section-accent"></div>
        <span class="font-medium text-white">提现地址</span>
      </div>
      <div class="rounded-xl border border-[#334155] bg-white/5 p-4">
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1 break-all font-mono text-sm text-white">
            {{ withdrawAddress || '暂未绑定钱包地址' }}
          </div>
          <button
            :disabled="!withdrawAddress"
            class="rounded-lg bg-[#00FFA3]/10 p-2 disabled:cursor-not-allowed disabled:opacity-50"
            @click="copyAddress"
          >
            <Copy class="h-4 w-4 text-[#00FFA3]" />
          </button>
        </div>
      </div>
      <p v-if="addressError" class="mt-3 text-sm text-rose-400">{{ addressError }}</p>
    </div>

    <div class="mb-6 rounded-xl border border-[#334155] bg-white/5 p-4">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-gray-400">手续费</span>
        <span class="text-white">{{ feeRateDisplay }}%</span>
      </div>
      <div class="mb-3 flex items-center justify-between">
        <span class="text-gray-400">提现金额</span>
        <span class="text-white">{{ finalAmountDisplay }} USDT</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-400">预计到账</span>
        <span class="font-semibold text-[#00FFA3]">{{ actualAmount }} USDT</span>
      </div>
    </div>

    <button
      :disabled="!canSubmit"
      class="w-full rounded-xl py-4 font-semibold"
      :class="
        canSubmit
          ? 'bg-[#00FFA3] text-[#121212]'
          : 'cursor-not-allowed bg-white/10 text-gray-500'
      "
      @click="handleWithdraw"
    >
      {{ isSubmitting ? '提交中...' : '确认提现' }}
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, useUserStore, useWithdrawStore } from '@/stores'
import { Wallet, Copy } from 'lucide-vue-next'
import PageHeader from '@/components/PageHeader.vue'
import GlowCard from '@/components/GlowCard.vue'
import AmountSelector from '@/components/AmountSelector.vue'
import { useUi } from '@/composables/useUi'
import { isValidTrc20Address } from '@/utils/businessRecharge'
import { copyText } from '@/utils/clipboard'

const router = useRouter()
const userStore = useUserStore()
const withdrawStore = useWithdrawStore()
const appStore = useAppStore()
const { toast, confirm } = useUi()

const quickAmounts = [100, 200, 300, 500]
const finalAmountValue = ref(0)
const feeRate = ref(2)
const exchangeRate = ref(0)
const isSubmitting = ref(false)

const withdrawAddress = computed(() => (userStore.currentUser.walletAddress || '').trim())
const balance = computed(() => Number(userStore.currentUser.balance || 0))
const balanceDisplay = computed(() => balance.value.toFixed(2))
const finalAmount = computed(() => Number(finalAmountValue.value || 0))
const feeRateDisplay = computed(() => feeRate.value.toFixed(2).replace(/\.00$/, ''))
const finalAmountDisplay = computed(() =>
  finalAmount.value > 0 ? finalAmount.value.toFixed(2) : '0.00',
)
const actualAmount = computed(() => {
  if (finalAmount.value <= 0) {
    return '0.00'
  }

  return ((finalAmount.value * (100 - feeRate.value)) / 100).toFixed(2)
})
const cnyBalance = computed(() => (balance.value * exchangeRate.value).toFixed(2))

const amountError = computed(() => {
  if (!finalAmount.value) {
    return ''
  }
  if (finalAmount.value < 100) {
    return '提现金额必须大于等于 100 USDT'
  }
  if (finalAmount.value > balance.value) {
    return '余额不足'
  }
  return ''
})

const addressError = computed(() => {
  if (!withdrawAddress.value) {
    return '请先绑定 TRC-20 钱包地址'
  }
  if (!isValidTrc20Address(withdrawAddress.value)) {
    return '当前钱包地址格式不正确，请先修改后再提现'
  }
  return ''
})

const canSubmit = computed(() => {
  return !amountError.value && !addressError.value && finalAmount.value > 0 && !isSubmitting.value
})

onMounted(async () => {
  await appStore.load()
  exchangeRate.value = Number(appStore.getConfigValue('usdt_rate') || 0)
  feeRate.value = Number(appStore.getConfigValue('withdraw_fee_rate') || 2)
})

const copyAddress = async () => {
  if (!withdrawAddress.value) {
    return
  }

  const copied = await copyText(withdrawAddress.value)
  if (copied) {
    toast.success('地址已复制')
  } else {
    toast.error('复制失败，请手动长按地址复制')
  }
}

const handleWithdraw = async () => {
  if (amountError.value) {
    toast.warning(amountError.value)
    return
  }
  if (addressError.value) {
    toast.warning(addressError.value)
    return
  }
  if (isSubmitting.value) {
    return
  }

  const confirmed = await confirm.open({
    type: 'warning',
    title: '确认提现',
    message: `提现地址：${withdrawAddress.value}\n提现金额：${finalAmountDisplay.value} USDT\n手续费：${feeRateDisplay.value}%\n预计到账：${actualAmount.value} USDT`,
    confirmText: '确认提交',
    cancelText: '再检查一下',
  })

  if (!confirmed) {
    return
  }

  isSubmitting.value = true
  try {
    await withdrawStore.applyWithdraw(
      { amount: finalAmount.value },
      { suppressErrorToast: true },
    )
    toast.success('提现申请已提交')
    router.replace('/records?tab=1')
  } catch (error) {
    toast.error(error.message || '提现申请提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>
