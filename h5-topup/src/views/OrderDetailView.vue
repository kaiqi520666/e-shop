<template>
  <div class="p-4 pt-22">
    <PageHeader title="订单详情" />

    <div v-if="loading" class="py-20 text-center text-sm text-gray-400">订单详情加载中...</div>

    <div v-else-if="errorMessage" class="py-20 text-center">
      <EmptyState :icon="FileX" text="订单加载失败" />
      <button class="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm text-white" @click="loadDetail">
        重新加载
      </button>
    </div>

    <div v-else-if="order" class="space-y-4">
      <div class="rounded-xl border border-[#334155] bg-white/5 p-6 text-center">
        <div class="mb-3 text-2xl font-bold" :class="getStatusTextClass(order.status)">
          {{ getStatusText(order.status) }}
        </div>
        <button class="inline-flex items-center gap-1 text-sm text-gray-400" @click="copyToClipboard(order.orderNo)">
          订单号 {{ order.orderNo }}
          <Copy class="h-3 w-3" />
        </button>
      </div>

      <div class="rounded-xl border border-[#334155] bg-white/5 p-4">
        <div class="mb-4 flex items-center gap-3">
          <div class="section-accent"></div>
          <span class="font-medium text-white">基本信息</span>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">业务类型</span>
            <span class="text-white">{{ order.categoryName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">创建时间</span>
            <span class="text-white">{{ order.createTime }}</span>
          </div>
          <div v-if="order.completeTime" class="flex justify-between">
            <span class="text-gray-400">完成时间</span>
            <span class="text-white">{{ order.completeTime }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-[#334155] bg-white/5 p-4">
        <div class="mb-4 flex items-center gap-3">
          <div class="section-accent"></div>
          <span class="font-medium text-white">金额信息</span>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">充值金额</span>
            <span class="text-white">¥{{ order.rmbAmount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">支付金额</span>
            <span class="text-[#00FFA3]">{{ order.usdtAmount }} USDT</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">参考汇率</span>
            <span class="text-white">1 USDT = ¥{{ exchangeRate }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button @click="$router.push('/orders')" class="flex-1 rounded-xl bg-white/10 py-3 font-medium text-white">
          返回列表
        </button>
        <button
          v-if="order.status === 0"
          @click="cancelOrder"
          class="flex-1 rounded-xl bg-red-500/10 py-3 font-medium text-red-400"
        >
          取消订单
        </button>
      </div>
    </div>

    <EmptyState v-else :icon="FileX" text="订单不存在" py="py-20" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { FileX, Copy } from 'lucide-vue-next'
import { useAppStore, useOrderStore, useUserStore } from '@/stores'
import { useOrderStatus } from '@/composables/useOrderStatus'
import { useUi } from '@/composables/useUi'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { copyText } from '@/utils/clipboard'

const route = useRoute()
const orderStore = useOrderStore()
const appStore = useAppStore()
const userStore = useUserStore()
const { toast, confirm } = useUi()
const { getStatusTextClass, getStatusText } = useOrderStatus()

const order = ref(null)
const exchangeRate = ref(0)
const loading = ref(false)
const errorMessage = ref('')

const loadDetail = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const [detailRes] = await Promise.all([
      orderStore.getDetail({ orderNo: route.params.orderNo }),
      appStore.load(),
    ])
    order.value = detailRes.data || null
    exchangeRate.value = Number(appStore.getConfigValue('usdt_rate') || 0)
  } catch (error) {
    order.value = null
    errorMessage.value = error.message || '订单加载失败'
  } finally {
    loading.value = false
  }
}

const cancelOrder = async () => {
  const confirmed = await confirm.open({
    type: 'warning',
    title: '取消订单',
    message: '确认取消当前订单吗？',
    confirmText: '确认取消',
    cancelText: '保留订单',
  })
  if (!confirmed) {
    return
  }

  const ok = await orderStore.cancelOrder({ id: order.value.id })
  if (ok) {
    order.value.status = 3
    await userStore.getUserInfo(true)
    toast.success('取消订单成功')
  } else {
    toast.error('取消订单失败')
  }
}

const copyToClipboard = async (text) => {
  const copied = await copyText(text)
  if (copied) {
    toast.success('已复制')
  } else {
    toast.error('复制失败，请手动长按选择复制')
  }
}

loadDetail()
</script>
