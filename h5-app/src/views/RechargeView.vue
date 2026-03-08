<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { formatPrice } from '@/utils'
import { walletAddress } from '@/mock/data'
import { rechargeApi } from '@/api/modules/user/recharge.api'
import Header from '@/components/layout/Header.vue'
import Loading from '@/components/common/Loading.vue'
import { Copy, QrCode, Clock, List } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const toast = inject('toast')

const amount = ref(route.query.amount || '')
const loading = ref(false)
const isFixedAmount = computed(() => !!route.query.amount)

// 当前充值订单
const currentOrderNo = ref('')
const showPaymentInfo = computed(() => !!currentOrderNo.value)

// Tab 切换
const activeTab = ref('recharge')
const records = ref([])

const statusConfig = {
  0: { label: '待充值', color: 'text-orange-500', bg: 'bg-orange-500/20' },
  1: { label: '已完成', color: 'text-green-500', bg: 'bg-green-500/20' },
  2: { label: '已超时', color: 'text-red-500', bg: 'bg-red-500/20' },
}

async function loadRecords() {
  try {
    const res = await rechargeApi.getList({ page: 1, size: 20 })
    if (res.code === 1000) {
      records.value = res.data.list
    }
  } catch (error) {
    console.error('加载充值记录失败:', error)
  }
}

function setActiveTab(tab) {
  activeTab.value = tab
  if (tab === 'records') {
    loadRecords()
  }
}

// 10分钟倒计时
const COUNTDOWN = 10 * 60 // 10分钟 = 600秒
const remainingTime = ref(COUNTDOWN)
let timer = null

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

function startCountdown() {
  remainingTime.value = COUNTDOWN
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      clearInterval(timer)
      toast.info('充值订单已超时，请重新发起充值')
      currentOrderNo.value = ''
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${walletAddress}`

function copyWallet() {
  navigator.clipboard
    .writeText(walletAddress)
    .then(() => {
      toast.success('钱包地址已复制')
    })
    .catch(() => {
      toast.info('请手动复制地址')
    })
}

async function submitRecharge() {
  const num = Number(amount.value)
  if (isNaN(num) || num <= 0) {
    toast.error('请输入有效金额')
    return
  }
  loading.value = true
  try {
    const res = await rechargeApi.apply({ amount: num })
    if (res.code === 1000) {
      currentOrderNo.value = res.data.orderNo
      startCountdown()
      toast.success('充值申请已提交，请在倒计时内完成转账')
    } else {
      toast.error(res.message || '充值失败')
    }
  } catch (error) {
    toast.error(error.message || '充值失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pb-24">
    <Header title="充值" show-back />
    <Loading :visible="loading" />

    <div class="px-4 pt-4">
      <!-- Tabs -->
      <div class="mb-4 flex rounded-xl border border-border bg-bg-card p-1">
        <button
          class="flex-1 rounded-lg py-2 text-sm font-medium transition-colors cursor-pointer"
          :class="
            activeTab === 'recharge'
              ? 'bg-gold text-bg-primary'
              : 'text-text-secondary hover:text-text-primary'
          "
          @click="setActiveTab('recharge')"
        >
          充值
        </button>
        <button
          class="flex-1 rounded-lg py-2 text-sm font-medium transition-colors cursor-pointer"
          :class="
            activeTab === 'records'
              ? 'bg-gold text-bg-primary'
              : 'text-text-secondary hover:text-text-primary'
          "
          @click="setActiveTab('records')"
        >
          充值记录
        </button>
      </div>

      <!-- Recharge Tab -->
      <template v-if="activeTab === 'recharge'">
        <!-- Amount input -->
        <div class="mb-6 rounded-xl border border-border bg-bg-card p-4">
          <label for="recharge-amount" class="mb-2 block text-sm text-text-secondary">
            充值金额 (USDT)
          </label>
          <input
            id="recharge-amount"
            v-model="amount"
            type="number"
            step="0.01"
            :disabled="isFixedAmount || showPaymentInfo"
            :placeholder="isFixedAmount ? '' : '请输入金额'"
            :class="[
              'w-full rounded-lg border border-border bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none',
              isFixedAmount || showPaymentInfo ? 'opacity-50 cursor-not-allowed' : '',
            ]"
          />
        </div>

        <!-- Submit Button -->
        <button
          v-if="!showPaymentInfo"
          type="button"
          :disabled="loading || !amount"
          class="w-full rounded-lg border border-dashed border-gold/50 bg-gold/10 py-3 text-sm font-medium text-gold transition-colors duration-200 hover:bg-gold/20 disabled:opacity-50 cursor-pointer"
          @click="submitRecharge"
        >
          提交充值申请
        </button>

        <!-- USDT TRC20 info -->
        <div v-if="showPaymentInfo" class="mb-6 rounded-xl border border-border bg-bg-card p-4">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-medium text-text-secondary">USDT (TRC20) 充值</h3>
            <div class="flex items-center gap-1 text-xs text-orange-500">
              <Clock class="h-3 w-3" />
              <span>{{ formattedTime }}</span>
            </div>
          </div>
          <p class="mb-4 text-xs text-text-muted">
            请在 {{ formattedTime }} 内完成转账，超时订单将自动取消
          </p>
          <div class="mb-4 rounded-lg bg-bg-secondary p-3">
            <p class="text-xs text-text-muted mb-1">订单号</p>
            <p class="font-mono text-sm text-gold">{{ currentOrderNo }}</p>
          </div>
          <div class="mb-4 flex justify-center">
            <img
              :src="qrUrl"
              alt="USDT TRC20 收款二维码"
              class="h-36 w-36 rounded-lg bg-white p-2"
              loading="lazy"
            />
          </div>
          <div class="flex items-center gap-2 rounded-lg bg-bg-secondary p-3">
            <QrCode class="h-4 w-4 shrink-0 text-gold" />
            <code class="flex-1 truncate text-xs text-text-secondary">{{ walletAddress }}</code>
            <button
              type="button"
              class="shrink-0 text-xs text-gold transition-colors duration-200 hover:text-gold-light cursor-pointer"
              @click="copyWallet"
            >
              <Copy class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- View Records Button -->
        <button
          v-if="showPaymentInfo"
          type="button"
          class="w-full rounded-lg border border-dashed border-gold/50 bg-gold/10 py-3 text-sm font-medium text-gold transition-colors duration-200 hover:bg-gold/20 cursor-pointer"
          @click="setActiveTab('records')"
        >
          查看充值记录
        </button>
      </template>

      <!-- Records Tab -->
      <div v-else>
        <div
          v-if="records.length === 0"
          class="rounded-xl border border-border bg-bg-card p-8 text-center"
        >
          <List class="mx-auto h-8 w-8 text-text-muted mb-2" />
          <p class="text-sm text-text-muted">暂无充值记录</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="record in records"
            :key="record.id"
            class="rounded-xl border border-border bg-bg-card p-4"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="text-lg font-semibold text-green-500">
                  +{{ Number(record.amount).toFixed(2) }} USDT
                </p>
                <p class="text-xs text-text-muted mt-1">{{ record.createTime }}</p>
              </div>
              <span
                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                :class="[statusConfig[record.status]?.bg, statusConfig[record.status]?.color]"
              >
                {{ statusConfig[record.status]?.label }}
              </span>
            </div>
            <p class="text-xs text-text-muted">订单号: {{ record.orderNo }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
