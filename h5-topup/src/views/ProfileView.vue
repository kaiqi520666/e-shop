<template>
  <div class="p-4">
    <div
      class="group relative mb-4 overflow-hidden rounded-2xl border border-[#334155] bg-linear-to-br from-[#1a1a2e] to-[#0d0d15] p-5"
    >
      <MatrixBackground />
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyME00MCA0MFYyMEwwIDQwaDQweiIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4=')] opacity-10"
      ></div>
      <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#00FFA3]/5 blur-2xl transition-colors group-hover:bg-[#00FFA3]/10"></div>
      <div class="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[#00FFA3]/5 blur-xl"></div>
      <div
        class="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style="box-shadow: inset 0 0 20px rgba(0, 255, 163, 0.1)"
      ></div>

      <div class="relative z-10">
        <div class="mb-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#00FFA3] bg-[#00FFA3]/20">
              <User class="h-6 w-6 text-[#00FFA3]" />
            </div>
            <div>
              <div class="text-base font-bold text-white">
                {{ userStore.currentUser.username || '未设置用户名' }}
              </div>
              <div class="text-xs text-gray-400">
                {{ userStore.currentUser.phone || '未绑定手机号' }}
              </div>
            </div>
          </div>

          <button
            class="flex items-center gap-1.5 rounded-full bg-[#00FFA3]/10 px-2.5 py-1 text-xs text-[#00FFA3]"
            @click="handleRefresh"
          >
            <RefreshCw class="h-3 w-3" />
            <span>刷新</span>
          </button>
        </div>

        <div class="mb-1 text-xs text-gray-400">总资产</div>
        <div class="mb-1 flex items-end gap-2">
          <span class="text-3xl font-bold text-[#00FFA3]" style="text-shadow: 0 0 20px rgba(0, 255, 163, 0.5)">
            {{ balanceDisplay }}
          </span>
          <span class="mb-1 text-lg text-[#00FFA3]">USDT</span>
        </div>
        <div class="mb-5 text-sm text-gray-400">≈ ¥{{ cnyBalance }} CNY</div>

        <div class="flex gap-3">
          <button
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00FFA3] py-3 font-semibold text-[#121212] transition-colors hover:bg-[#00FFA3]/90"
            @click="router.push('/recharge')"
          >
            <Zap class="h-4 w-4" />
            <span>充值</span>
          </button>

          <button
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            @click="handleWithdraw"
          >
            <ArrowDownToLine class="h-4 w-4" />
            <span>提现</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-4 grid grid-cols-3 gap-3">
      <div class="relative overflow-hidden rounded-xl border border-[#334155] bg-white/5 p-3 text-center">
        <div class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#3B82F6]/10"></div>
        <div class="relative z-10 flex flex-col items-center">
          <ShoppingCart class="mb-1 h-5 w-5 text-[#3B82F6]" />
          <div class="text-lg font-bold text-[#3B82F6]">{{ cumulative.total.toFixed(2) }}</div>
          <div class="text-xs text-gray-400">累计消费</div>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-xl border border-[#334155] bg-white/5 p-3 text-center">
        <div class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#8B5CF6]/10"></div>
        <div class="relative z-10 flex flex-col items-center">
          <Coins class="mb-1 h-5 w-5 text-[#8B5CF6]" />
          <div class="text-lg font-bold text-[#8B5CF6]">{{ cumulative.amount.toFixed(2) }}</div>
          <div class="text-xs text-gray-400">累计佣金</div>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-xl border border-[#334155] bg-white/5 p-3 text-center">
        <div class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#10B981]/10"></div>
        <div class="relative z-10 flex flex-col items-center">
          <ReceiptText class="mb-1 h-5 w-5 text-[#10B981]" />
          <div class="text-lg font-bold text-[#10B981]">{{ cumulative.count }}</div>
          <div class="text-xs text-gray-400">成功订单</div>
        </div>
      </div>
    </div>

    <button
      class="group relative mb-3 w-full overflow-hidden rounded-xl border border-[#334155] bg-linear-to-br from-[#3B82F6]/20 to-[#121212] p-4 text-left transition-all hover:border-[#3B82F6]/50"
      @click="router.push('/agent')"
    >
      <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#3B82F6] opacity-20 transition-opacity group-hover:opacity-40"></div>
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-[#3B82F6]/20 p-2">
            <TrendingUp class="h-5 w-5 text-[#3B82F6]" />
          </div>
          <div>
            <div class="font-medium text-white">代理中心</div>
            <div class="text-xs text-gray-400">查看团队数据和返佣设置</div>
          </div>
        </div>
        <ChevronRight class="h-5 w-5 text-[#3B82F6]" />
      </div>
    </button>

    <button
      class="group relative mb-4 w-full overflow-hidden rounded-xl border border-[#334155] bg-linear-to-br from-[#8B5CF6]/20 to-[#121212] p-4 text-left transition-all hover:border-[#8B5CF6]/50"
      @click="copyInviteCode"
    >
      <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#8B5CF6] opacity-20 transition-opacity group-hover:opacity-40"></div>
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-[#8B5CF6]/20 p-2">
            <QrCode class="h-5 w-5 text-[#8B5CF6]" />
          </div>
          <div>
            <div class="font-medium text-white">专属邀请码</div>
            <div class="text-sm font-bold text-[#8B5CF6]">
              {{ userStore.currentUser.inviteCode || '未生成' }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1 rounded-lg bg-[#8B5CF6]/20 px-3 py-1.5 text-sm text-[#8B5CF6]">
          <Copy class="h-4 w-4" />
          <span>复制</span>
        </div>
      </div>
    </button>

    <div class="space-y-2">
      <button
        v-for="menu in menus"
        :key="menu.id"
        class="flex w-full items-center justify-between rounded-xl border border-[#334155] bg-white/5 p-4 text-left transition-all hover:border-white/20 hover:bg-white/10"
        :disabled="menu.id === 'syncData' && isSyncingData"
        :class="menu.id === 'syncData' && isSyncingData ? 'cursor-not-allowed opacity-70' : ''"
        @click="handleMenuClick(menu)"
      >
        <div class="flex items-center gap-3">
          <div class="rounded-lg p-2" :style="{ backgroundColor: `${menu.color}20` }">
            <component :is="menu.icon" class="h-4 w-4" :style="{ color: menu.color }" />
          </div>
          <span class="font-medium text-white">
            {{ menu.id === 'syncData' && isSyncingData ? '同步中...' : menu.label }}
          </span>
        </div>
        <ChevronRight class="h-4 w-4 text-gray-500" />
      </button>
    </div>

    <button
      class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 font-medium text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/20"
      @click="handleLogout"
    >
      <LogOut class="h-4 w-4" />
      <span>退出登录</span>
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  ChevronRight,
  QrCode,
  CreditCard,
  TrendingUp,
  Zap,
  ArrowDownToLine,
  LogOut,
  Copy,
  ShoppingCart,
  Coins,
  ReceiptText,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
} from 'lucide-vue-next'
import MatrixBackground from '@/components/MatrixBackground.vue'
import { useAppStore, useBannerStore, useCategoryStore, useNoticeStore, useOrderStore, useUserStore } from '@/stores'
import { useUi } from '@/composables/useUi'

const router = useRouter()
const userStore = useUserStore()
const orderStore = useOrderStore()
const appStore = useAppStore()
const bannerStore = useBannerStore()
const categoryStore = useCategoryStore()
const noticeStore = useNoticeStore()
const { toast, confirm } = useUi()
const exchangeRate = ref(0)
const isSyncingData = ref(false)

const cumulative = ref({
  amount: 0,
  count: 0,
  total: 0,
})

const balanceDisplay = computed(() => Number(userStore.currentUser.balance || 0).toFixed(2))
const cnyBalance = computed(() => (Number(userStore.currentUser.balance || 0) * exchangeRate.value).toFixed(2))

onMounted(async () => {
  await orderStore.load()
  await appStore.load()
  syncPageMetrics()
})

const menus = [
  { id: 'wallet', label: '钱包地址', icon: Wallet, color: '#00FFA3' },
  { id: 'records', label: '消费记录', icon: CreditCard, color: '#8B5CF6' },
  { id: 'rechargeRecords', label: '充值记录', icon: ArrowDownLeft, color: '#00FFA3' },
  { id: 'withdrawRecords', label: '提现记录', icon: ArrowUpRight, color: '#EF4444' },
  { id: 'syncData', label: '同步数据', icon: RefreshCw, color: '#F59E0B' },
]

const syncPageMetrics = () => {
  cumulative.value.amount = Number(orderStore.cumulative?.commission?.amount || 0)
  cumulative.value.count = Number(orderStore.cumulative?.order?.count || 0)
  cumulative.value.total = Number(orderStore.cumulative?.order?.total || 0)
  exchangeRate.value = Number(appStore.getConfigValue('usdt_rate') || 0)
}

const handleMenuClick = async (menu) => {
  if (menu.id === 'wallet') router.push('/wallet')
  if (menu.id === 'records') router.push('/records')
  if (menu.id === 'rechargeRecords') router.push('/records?tab=0')
  if (menu.id === 'withdrawRecords') router.push('/records?tab=1')
  if (menu.id === 'syncData') await handleSyncData()
}

const handleWithdraw = () => {
  if (!userStore.currentUser.walletAddress) {
    toast.warning('请先绑定钱包地址')
    setTimeout(() => router.push('/wallet'), 1500)
    return
  }
  router.push('/withdraw')
}

const copyInviteCode = () => userStore.copyInviteCode()

const handleLogout = () => {
  userStore.logout()
  orderStore.clear()
  appStore.clear()
  categoryStore.clear()
  noticeStore.reset()
  router.replace('/login')
}

const handleRefresh = async () => {
  await userStore.getUserInfo()
  toast.success('刷新成功')
}

const handleSyncData = async () => {
  if (isSyncingData.value) {
    return
  }

  const confirmed = await confirm.open({
    type: 'warning',
    title: '同步数据',
    message: '将清理首页和个人中心使用的本地缓存，并重新向服务器请求最新数据。是否继续？',
    confirmText: '立即同步',
    cancelText: '取消',
  })

  if (!confirmed) {
    return
  }

  isSyncingData.value = true

  try {
    orderStore.clear()
    appStore.clear()
    bannerStore.clear()
    categoryStore.clear()
    noticeStore.reset()

    await Promise.all([
      userStore.getUserInfo({ suppressErrorToast: true }),
      orderStore.refresh(),
      appStore.refresh(),
      bannerStore.refresh(),
      categoryStore.refresh(),
      noticeStore.load(true),
    ])

    syncPageMetrics()
    toast.success('数据同步完成')
  } catch {
    toast.error('同步失败，请稍后重试')
  } finally {
    isSyncingData.value = false
  }
}
</script>
