<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { withdrawApi } from '@/api/modules/user/withdraw.api'
import { maskAddress } from '@/utils'
import Header from '@/components/layout/Header.vue'
import { ArrowUpCircle, Clock, CheckCircle, XCircle, List } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const user = userStore.currentUser
const toast = inject('toast')

const amount = ref('')
const password = ref('')
const loading = ref(false)
const records = ref([])
const activeTab = ref('apply') // 'apply' | 'records'

const statusConfig = {
  0: { label: '审核中', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/20' },
  1: { label: '已完成', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20' },
  2: { label: '已拒绝', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/20' },
}

function getStatusConfig(status) {
  return (
    statusConfig[status] ?? {
      label: '未知',
      icon: Clock,
      color: 'text-text-muted',
      bg: 'bg-bg-secondary',
    }
  )
}

async function loadRecords() {
  try {
    const res = await withdrawApi.getList({ page: 1, size: 20 })
    if (res.code === 1000) {
      records.value = res.data.list
    }
  } catch (error) {
    console.error('加载提现记录失败:', error)
  }
}

async function submitWithdraw() {
  const num = Number(amount.value)
  if (isNaN(num) || num <= 0) {
    toast.error('请输入有效金额')
    return
  }
  if (num > (user?.balance || 0)) {
    toast.error('余额不足')
    return
  }
  if (!password.value) {
    toast.error('请输入支付密码')
    return
  }

  loading.value = true
  try {
    const res = await userStore.withdraw(num, password.value)
    if (res.success) {
      toast.success('提现申请已提交，请等待审核')
      amount.value = ''
      password.value = ''
      activeTab.value = 'records'
      await loadRecords()
      // await userStore.fetchUserInfo()
    } else {
      toast.error(res.message || '提现申请失败')
    }
  } catch (error) {
    toast.error(error.message || '提现申请失败')
  } finally {
    loading.value = false
  }
}

function setActiveTab(tab) {
  activeTab.value = tab
  if (tab === 'records') {
    loadRecords()
  }
}

onMounted(() => {
  loadRecords()
})
</script>

<template>
  <div class="pb-24">
    <Header title="提现" show-back />

    <div class="px-4 pt-4">
      <!-- Balance Card -->
      <div
        class="mb-6 overflow-hidden rounded-2xl border border-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.15),transparent_70%)] bg-linear-to-br from-gold/10 via-gold/5 to-transparent p-5 shadow-[0_0_20px_rgba(201,168,76,0.08)]"
      >
        <div class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl"></div>
        <div class="relative">
          <p class="text-xs font-medium uppercase tracking-wider text-gold/70">可提现余额</p>
          <div class="mt-2 flex items-baseline gap-1">
            <span class="text-3xl font-bold text-gold drop-shadow-[0_2px_8px_rgba(201,168,76,0.4)]">
              {{ Number(userStore.currentUser?.balance ?? 0).toFixed(2) }}
            </span>
            <span class="text-sm font-medium text-gold/80">USDT</span>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <div class="h-px flex-1 bg-linear-to-r from-gold/60 to-transparent"></div>
            <div class="h-1 w-1 rounded-full bg-gold"></div>
            <div class="h-px flex-1 bg-linear-to-l from-gold/40 to-transparent"></div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-4 flex rounded-xl border border-border bg-bg-card p-1">
        <button
          class="flex-1 rounded-lg py-2 text-sm font-medium transition-colors cursor-pointer"
          :class="
            activeTab === 'apply'
              ? 'bg-gold text-bg-primary'
              : 'text-text-secondary hover:text-text-primary'
          "
          @click="setActiveTab('apply')"
        >
          申请提现
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
          提现记录
        </button>
      </div>

      <!-- Apply Tab -->
      <div v-if="activeTab === 'apply'" class="space-y-4">
        <div class="rounded-xl border border-border bg-bg-card p-4">
          <div v-if="user?.walletAddress" class="mb-4">
            <p class="text-xs text-text-muted mb-1">提现至</p>
            <p class="font-mono text-sm text-text-primary">{{ maskAddress(user.walletAddress) }}</p>
          </div>
          <div v-else class="mb-4 rounded-lg bg-orange-500/10 p-3">
            <p class="text-sm text-orange-500">请先在个人中心绑定钱包地址</p>
          </div>

          <div>
            <label class="mb-2 block text-xs font-medium text-text-secondary">提现金额</label>
            <input
              v-model="amount"
              type="number"
              step="0.01"
              placeholder="请输入提现金额"
              class="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
            />
          </div>

          <div class="mt-4">
            <label class="mb-2 block text-xs font-medium text-text-secondary">支付密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入支付密码"
              class="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
            />
          </div>

          <button
            :disabled="loading || !amount || !password || !user?.walletAddress"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-medium text-bg-primary transition-colors hover:bg-gold-light disabled:opacity-50 cursor-pointer"
            @click="submitWithdraw"
          >
            <ArrowUpCircle class="h-4 w-4" />
            {{ loading ? '提交中...' : '确认提现' }}
          </button>
        </div>

        <p class="text-xs text-text-muted text-center">
          提现申请提交后，预计 1-3 个工作日内完成审核
        </p>
      </div>

      <!-- Records Tab -->
      <div v-else>
        <div
          v-if="records.length === 0"
          class="rounded-xl border border-border bg-bg-card p-8 text-center"
        >
          <List class="mx-auto h-8 w-8 text-text-muted mb-2" />
          <p class="text-sm text-text-muted">暂无提现记录</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="record in records"
            :key="record.id"
            class="rounded-xl border border-border bg-bg-card p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-lg font-semibold text-text-primary">
                  -{{ Number(record.amount).toFixed(2) }} USDT
                </p>
                <p class="text-xs text-text-muted mt-1">{{ record.createTime }}</p>
              </div>
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                :class="[getStatusConfig(record.status).bg, getStatusConfig(record.status).color]"
              >
                <component :is="getStatusConfig(record.status).icon" class="h-3 w-3" />
                {{ getStatusConfig(record.status).label }}
              </span>
            </div>
            <div class="text-xs text-text-muted">
              <p>提现至: {{ maskAddress(record.walletAddress) }}</p>
              <p v-if="record.remark" class="mt-1 text-orange-500">原因: {{ record.remark }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
