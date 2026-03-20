<template>
  <div class="p-4 pt-22">
    <PageHeader :title="currentService.name" :divider-color="currentService.color" />

    <div class="mb-6">
      <div class="mb-4 flex items-center gap-3">
        <div class="h-5 w-1 rounded-full" :style="accentStyle"></div>
        <span class="font-medium text-white">充值金额</span>
      </div>
      <AmountSelector
        v-model="finalAmountValue"
        :amounts="currentService.amounts"
        prefix="￥"
        suffix="CNY"
      />
      <p v-if="amountError" class="mt-3 text-sm text-rose-400">{{ amountError }}</p>
    </div>

    <div class="mb-6">
      <div class="mb-4 flex items-center gap-3">
        <div class="h-5 w-1 rounded-full" :style="accentStyle"></div>
        <span class="font-medium text-white">填写信息</span>
      </div>
      <div class="space-y-4">
        <template v-for="field in currentSchema.fields" :key="field.key">
          <BottomSheetSelect
            v-if="field.type === 'select'"
            v-model="form[field.key]"
            :options="field.options"
            :title="field.title"
            :placeholder="field.placeholder"
          />
          <input
            v-else
            v-model.trim="form[field.key]"
            :type="field.type"
            :placeholder="field.placeholder"
            class="input-field"
          />
        </template>
      </div>
      <p v-if="formError" class="mt-3 text-sm text-rose-400">{{ formError }}</p>
    </div>

    <div class="mb-6 rounded-xl border border-[#334155] bg-white/5 p-4">
      <div class="mb-3 flex justify-between text-gray-400">
        <span>充值金额</span>
        <span class="text-white">￥{{ finalAmountDisplay }}</span>
      </div>
      <div class="mb-3 flex justify-between text-gray-400">
        <span>折扣</span>
        <span class="text-green-400">{{ discountDisplay }} 折</span>
      </div>
      <div class="mb-3 flex justify-between text-gray-400">
        <span>参考汇率</span>
        <span class="text-white">1 USDT = ￥{{ exchangeRateDisplay }}</span>
      </div>
      <div class="flex justify-between border-t border-[#334155] pt-3">
        <span class="font-medium text-white">合计 USDT</span>
        <span class="text-lg font-bold text-green-400">≈ {{ totalUSDT }}</span>
      </div>
    </div>

    <button
      :disabled="!canSubmit"
      class="w-full rounded-xl py-4 text-lg font-bold transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
      :style="canSubmit ? { backgroundColor: currentService.color, color: '#121212' } : undefined"
      @click="handleSubmit"
    >
      {{ isSubmitting ? '提交中...' : '确认充值' }}
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useCategoryStore, useOrderStore, useUserStore } from '@/stores'
import { useUi } from '@/composables/useUi'
import PageHeader from '@/components/PageHeader.vue'
import AmountSelector from '@/components/AmountSelector.vue'
import BottomSheetSelect from '@/components/BottomSheetSelect.vue'
import {
  buildBusinessRechargePayload,
  createBusinessRechargeForm,
  getBusinessRechargeSchema,
  validateBusinessRechargeForm,
} from '@/utils/businessRecharge'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const orderStore = useOrderStore()
const categoryStore = useCategoryStore()
const appStore = useAppStore()
const { toast, confirm } = useUi()

const type = computed(() => route.params.type)
const exchangeRate = ref(0)
const finalAmountValue = ref(0)
const form = ref(createBusinessRechargeForm())
const isSubmitting = ref(false)

const category = computed(() => categoryStore.getCategoryByKeyword(type.value))
const currentSchema = computed(() => getBusinessRechargeSchema(type.value))
const currentService = computed(() => currentSchema.value.service)
const accentStyle = computed(() => ({
  backgroundColor: currentService.value.color,
  boxShadow: `0 0 10px ${currentService.value.color}`,
}))
const finalAmount = computed(() => Number(finalAmountValue.value || 0))
const discount = computed(() => Number(category.value?.discount || currentService.value.discount))
const discountDisplay = computed(() => discount.value.toFixed(1).replace(/\.0$/, ''))
const exchangeRateDisplay = computed(() => exchangeRate.value.toFixed(2).replace(/\.00$/, ''))
const totalUSDT = computed(() => {
  if (!exchangeRate.value || !finalAmount.value) {
    return '0.00'
  }
  return ((finalAmount.value * (discount.value / 10)) / exchangeRate.value).toFixed(2)
})
const finalAmountDisplay = computed(() =>
  finalAmount.value > 0 ? finalAmount.value.toFixed(2) : '0.00',
)

const amountError = computed(() => {
  if (!finalAmount.value) {
    return ''
  }
  if (finalAmount.value <= 0) {
    return '请选择正确的充值金额'
  }
  if (!exchangeRate.value) {
    return '当前汇率不可用，请稍后再试'
  }
  if (Number(totalUSDT.value) > Number(userStore.currentUser.balance || 0)) {
    return '余额不足，请先充值 USDT'
  }
  return ''
})

const formError = computed(() => validateBusinessRechargeForm(type.value, form.value))
const canSubmit = computed(() => {
  return (
    !!category.value?.id &&
    !amountError.value &&
    !formError.value &&
    finalAmount.value > 0 &&
    !isSubmitting.value
  )
})

onMounted(async () => {
  await Promise.all([categoryStore.load(), appStore.load()])
  exchangeRate.value = Number(appStore.getConfigValue('usdt_rate') || 0)
})

const handleSubmit = async () => {
  if (!category.value?.id) {
    toast.error('当前业务分类不可用')
    return
  }
  if (amountError.value) {
    toast.warning(amountError.value)
    return
  }
  if (formError.value) {
    toast.warning(formError.value)
    return
  }
  if (isSubmitting.value) {
    return
  }

  const confirmed = await confirm.open({
    type: 'warning',
    title: '确认充值',
    message: `业务类型：${currentService.value.name}\n充值金额：￥${finalAmountDisplay.value}\n预计支付：${totalUSDT.value} USDT`,
    confirmText: '确认下单',
    cancelText: '再检查一下',
  })

  if (!confirmed) {
    return
  }

  isSubmitting.value = true
  try {
    const res = await orderStore.createOrder(
      buildBusinessRechargePayload(type.value, form.value, category.value.id, finalAmount.value),
      { suppressErrorToast: true },
    )

    try {
      await userStore.getUserInfo({ silent: true, suppressErrorToast: true })
    } catch {
      toast.warning('下单成功，但余额刷新失败，请稍后手动刷新')
    }

    router.push(`/orders/${res.orderNo}`)
  } catch (error) {
    toast.error(error.message || '下单失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>
