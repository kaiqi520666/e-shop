<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { useOrderStore } from '@/stores/order'
import { maskPhone, formatPrice, maskAddress } from '@/utils'
import Loading from '@/components/common/Loading.vue'

import {
  Copy,
  MapPin,
  LogOut,
  Users,
  Phone,
  CalendarDays,
  UserCircle,
  Package,
  MessageCircle,
  Settings,
  ChevronRight,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Crown,
  Receipt,
  TrendingUp,
  Wallet2,
  ShoppingBag,
  Sparkles,
  KeyRound,
  Link2,
  X,
  RefreshCw,
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const productStore = useProductStore()
const orderStore = useOrderStore()
const toast = inject('toast')

const loading = ref(true)

// 加载数据
onMounted(async () => {
  if (userStore.isLoggedIn) {
    await Promise.all([
      orderStore.fetchOrders(),
      userStore.fetchUserInfo(),
      userStore.fetchTeamCount(),
    ])
  }
  loading.value = false
})

// 累计消费
const totalConsumption = computed(() => {
  return orderStore.orderList
    .reduce((sum, order) => sum + (Number(order.totalUSDT) || 0), 0)
    .toFixed(4)
})

// 累计收入
const totalIncome = computed(() => {
  return userStore.currentUser?.totalIncome ?? 0
})

// 订单总数
const orderCount = computed(() => {
  return orderStore.orderList.length
})

function copyInviteCode() {
  if (!userStore.currentUser) return
  navigator.clipboard
    .writeText(userStore.currentUser?.inviteCode)
    .then(() => {
      toast.success('邀请码已复制')
    })
    .catch(() => {
      toast.info('请手动复制邀请码')
    })
}

function copyInviteLink() {
  if (!userStore.currentUser) return
  const link = `${window.location.origin}/register?code=${userStore.currentUser?.inviteCode}`
  navigator.clipboard
    .writeText(link)
    .then(() => {
      toast.success('注册链接已复制')
    })
    .catch(() => {
      toast.info('请手动复制链接')
    })
}

function handleLogout() {
  userStore.logout()
  toast.success('已退出登录')
  router.replace('/login')
}

// 刷新所有数据
const refreshing = ref(false)
async function refreshAllData() {
  if (refreshing.value) return

  refreshing.value = true
  try {
    // 并行请求多个接口
    await Promise.all([
      userStore.fetchUserInfo(),
      appStore.fetchConfigList(),
      productStore.fetchProducts(),
      productStore.fetchCategories(),
      orderStore.fetchOrders(),
      userStore.fetchDirectTeamCount(),
    ])
    toast.success('数据已刷新')
  } catch (e) {
    console.error('刷新数据失败:', e)
    toast.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

function placeholderClick() {
  toast.info('敬请期待')
}

// ========== 钱包相关 ==========
const showWalletModal = ref(false)
const walletModalMode = ref('bind') // 'bind' | 'withdraw'
const walletForm = ref({
  address: '',
  password: '',
  amount: '',
})

// 充值相关
function goToRecharge() {
  router.push('/recharge')
}

function openBindWallet() {
  walletModalMode.value = 'bind'
  walletForm.value = {
    address: userStore.currentUser?.walletAddress || '',
    password: '',
    amount: '',
  }
  showWalletModal.value = true
}

function openWithdraw() {
  router.push('/withdraw')
}

async function confirmWalletAction() {
  if (!walletForm.value.password) {
    return toast.error('请输入登录密码')
  }

  if (walletModalMode.value === 'bind') {
    // 绑定钱包
    if (!walletForm.value.address) {
      return toast.error('请输入钱包地址')
    }
    const result = await userStore.bindWallet(walletForm.value.address, walletForm.value.password)
    if (result.success) {
      showWalletModal.value = false
      toast.success('钱包绑定成功')
    } else {
      toast.error(result.message || '绑定失败')
    }
  } else {
    // 提现
    if (!walletForm.value.amount || Number(walletForm.value.amount) <= 0) {
      return toast.error('请输入提现金额')
    }
    if (Number(walletForm.value.amount) > (userStore.currentUser?.balance || 0)) {
      return toast.error('余额不足')
    }
    const result = await userStore.withdraw(walletForm.value.amount, walletForm.value.password)
    if (result.success) {
      showWalletModal.value = false
      toast.success(`提现申请已提交，请等待审核`)
    } else {
      toast.error(result.message || '提现失败')
    }
  }
}

const quickEntries = [
  { to: '/transactions', icon: Receipt, label: '消费记录' },
  { to: '/orders', icon: Package, label: '我的订单' },
  { to: '/address', icon: MapPin, label: '地址管理' },
  { href: 'https://t.me/sstxtz', icon: MessageCircle, label: '联系客服', external: true },
]
</script>

<template>
  <div>
    <Loading :visible="loading" />

    <!-- Hero: gradient + avatar + badge -->
    <div
      class="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.12),transparent_60%)] pb-8 pt-6"
    >
      <div class="px-4">
        <div class="flex items-center gap-5">
          <div
            class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-gold/60 bg-bg-card shadow-[0_0_24px_rgba(201,168,76,0.2)]"
          >
            <UserCircle class="h-12 w-12 text-gold" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="mt-1 flex items-start justify-between">
              <div class="flex items-center gap-2">
                <h2 class="font-heading text-xl font-bold text-text-primary">
                  {{ userStore.currentUser?.username }}
                </h2>
                <span
                  class="inline-block rounded-full border border-gold/50 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold"
                >
                  尊享会员
                </span>
              </div>
            </div>
            <p class="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
              <Phone class="h-3.5 w-3.5 text-gold" />
              {{ maskPhone(userStore.currentUser?.phone) }}
            </p>
          </div>
          <div class="text-right text-xs text-text-muted flex flex-col gap-3">
            <!-- 刷新按钮 -->
            <button
              :disabled="refreshing"
              @click="refreshAllData"
              class="flex items-center gap-1 rounded-lg bg-gold/10 px-2 py-1 text-xs text-gold transition-all hover:bg-gold/20 cursor-pointer"
              :class="{ 'animate-pulse': refreshing }"
            >
              <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': refreshing }" />
              <span>{{ refreshing ? '刷新中...' : '刷新' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 -mt-4">
      <!-- Balance & Wallet card -->
      <div
        class="mb-6 rounded-xl border border-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.15),transparent_70%)] bg-linear-to-br from-gold/10 via-gold/5 to-transparent p-5 shadow-[0_0_20px_rgba(201,168,76,0.08)]"
      >
        <!-- Balance Row -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 shadow-[0_0_12px_rgba(201,168,76,0.2)]"
            >
              <Wallet class="h-6 w-6 text-gold" />
            </div>
            <div>
              <p class="text-xs text-text-secondary">余额 (USDT)</p>
              <p class="text-2xl font-bold text-gold">{{ userStore.currentUser?.balance ?? 0 }}</p>
            </div>
          </div>
          <button
            @click="goToRecharge"
            class="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-xs font-medium text-gold transition-all duration-200 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_16px_rgba(201,168,76,0.2)] cursor-pointer"
          >
            <span>充值</span>
            <ChevronRight class="h-3 w-3" />
          </button>
        </div>

        <!-- Wallet Address Row -->
        <div class="rounded-lg border border-gold/20 bg-bg-card/50 p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Link2 class="h-4 w-4 text-gold" />
              <span class="text-xs text-text-secondary">钱包地址</span>
            </div>
            <button
              v-if="!userStore.currentUser?.walletAddress"
              class="flex items-center gap-1 text-xs text-gold hover:underline cursor-pointer"
              @click="openBindWallet"
            >
              <KeyRound class="h-3 w-3" />
              绑定钱包
            </button>
          </div>
          <p
            v-if="userStore.currentUser?.walletAddress"
            class="mt-1.5 font-mono text-xs text-text-primary truncate"
          >
            {{ maskAddress(userStore.currentUser?.walletAddress) }}
          </p>
          <p v-else class="mt-1.5 text-xs text-text-muted italic">未绑定钱包地址</p>
        </div>

        <!-- Action Buttons -->
        <div v-if="userStore.currentUser?.walletAddress" class="mt-3 flex gap-3">
          <button
            class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 py-2.5 text-xs font-medium text-gold transition-all duration-200 hover:bg-gold/10 hover:shadow-[0_0_12px_rgba(201,168,76,0.15)] cursor-pointer"
            @click="openBindWallet"
          >
            <KeyRound class="h-3.5 w-3.5" />
            修改钱包
          </button>
          <button
            class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold py-2.5 text-xs font-medium text-bg-primary transition-all duration-200 hover:bg-gold-light hover:shadow-[0_0_16px_rgba(201,168,76,0.25)] cursor-pointer"
            @click="openWithdraw"
          >
            <ArrowUpCircle class="h-3.5 w-3.5" />
            提现
          </button>
        </div>
      </div>

      <!-- Agent center card -->
      <router-link
        to="/agent"
        class="mb-6 flex items-center justify-between rounded-xl border border-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.15),transparent_70%)] bg-linear-to-br from-gold/10 via-gold/5 to-transparent p-5 shadow-[0_0_20px_rgba(201,168,76,0.08)] transition-all duration-200 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 shadow-[0_0_12px_rgba(201,168,76,0.2)]"
          >
            <Crown class="h-6 w-6 text-gold" />
          </div>
          <div>
            <p class="font-heading text-md font-medium text-gold">
              代理中心 · 团队 {{ userStore.currentUser?.teamCount ?? 0 }}人
            </p>
          </div>
        </div>
        <ChevronRight class="h-4 w-4 shrink-0 text-gold" />
      </router-link>

      <!-- Invite code: gold gradient + border -->
      <div
        class="mb-6 rounded-xl border border-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.12),transparent_70%)] bg-linear-to-br from-gold/10 via-gold/5 to-transparent p-5 shadow-[0_0_20px_rgba(201,168,76,0.06)]"
      >
        <h3 class="mb-3 font-heading text-sm font-medium text-gold">专属邀请码</h3>
        <div class="mb-3 flex items-center justify-between gap-4">
          <code class="font-mono text-2xl font-bold tracking-[0.3em] text-gold">
            {{ userStore.currentUser?.inviteCode }}
          </code>
          <button
            type="button"
            class="flex shrink-0 items-center gap-1.5 rounded-lg bg-gold/20 px-4 py-2.5 text-sm font-medium text-gold transition-colors duration-200 hover:bg-gold/30 cursor-pointer"
            @click="copyInviteCode"
          >
            <Copy class="h-4 w-4" />
            复制
          </button>
        </div>
        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gold/30 bg-gold/5 px-4 py-2.5 text-sm text-gold transition-colors duration-200 hover:bg-gold/10 cursor-pointer"
          @click="copyInviteLink"
        >
          <Copy class="h-4 w-4" />
          复制注册链接
        </button>
      </div>

      <!-- Stats: premium card design -->
      <div class="mb-8 grid grid-cols-3 gap-3">
        <!-- 累计消费 -->
        <div
          class="group relative overflow-hidden rounded-2xl border border-gold/20 bg-linear-to-br from-bg-card via-gold/5 to-transparent p-4 shadow-[0_0_20px_rgba(201,168,76,0.06)] transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,168,76,0.12)]"
        >
          <div
            class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gold/10 transition-transform group-hover:scale-150"
          />
          <div class="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-gold/5" />
          <div class="relative">
            <div
              class="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 shadow-[0_0_12px_rgba(201,168,76,0.15)]"
            >
              <TrendingUp class="h-4.5 w-4.5 text-gold" />
            </div>
            <p class="text-[12px] font-medium uppercase tracking-wider text-text-muted">累计消费</p>
            <p class="mt-1 text-lg font-bold text-gold">{{ totalConsumption }}</p>
          </div>
        </div>

        <!-- 累计收入 -->
        <div
          class="group relative overflow-hidden rounded-2xl border border-gold/20 bg-linear-to-br from-bg-card via-gold/5 to-transparent p-4 shadow-[0_0_20px_rgba(201,168,76,0.06)] transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,168,76,0.12)]"
        >
          <div
            class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gold/10 transition-transform group-hover:scale-150"
          />
          <div class="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-gold/5" />
          <div class="relative">
            <div
              class="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 shadow-[0_0_12px_rgba(201,168,76,0.15)]"
            >
              <Wallet2 class="h-4.5 w-4.5 text-gold" />
            </div>
            <p class="text-[12px] font-medium uppercase tracking-wider text-text-muted">累计收入</p>
            <p class="mt-1 text-lg font-bold text-gold">{{ totalIncome }}</p>
          </div>
        </div>

        <!-- 订单总数 -->
        <div
          class="group relative overflow-hidden rounded-2xl border border-gold/20 bg-linear-to-br from-bg-card via-gold/5 to-transparent p-4 shadow-[0_0_20px_rgba(201,168,76,0.06)] transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,168,76,0.12)]"
        >
          <div
            class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gold/10 transition-transform group-hover:scale-150"
          />
          <div class="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-gold/5" />
          <div class="relative">
            <div
              class="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 shadow-[0_0_12px_rgba(201,168,76,0.15)]"
            >
              <ShoppingBag class="h-4.5 w-4.5 text-gold" />
            </div>
            <p class="text-[12px] font-medium uppercase tracking-wider text-text-muted">订单总数</p>
            <p class="mt-1 text-lg font-bold text-gold">{{ orderCount }}</p>
          </div>
        </div>
      </div>

      <!-- Quick entries: simple list -->
      <div class="mb-8 flex flex-col gap-3">
        <template v-for="entry in quickEntries" :key="entry.label">
          <a
            v-if="entry.external"
            :href="entry.href"
            target="_blank"
            class="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4 transition-all duration-200 hover:border-gold/30 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <component :is="entry.icon" class="h-5 w-5 text-gold" />
              <span class="text-sm font-medium text-text-primary">{{ entry.label }}</span>
            </div>
            <ChevronRight class="h-4 w-4 text-text-muted" />
          </a>
          <router-link
            v-else
            :to="entry.to"
            class="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4 transition-all duration-200 hover:border-gold/30"
          >
            <div class="flex items-center gap-3">
              <component :is="entry.icon" class="h-5 w-5 text-gold" />
              <span class="text-sm font-medium text-text-primary">{{ entry.label }}</span>
            </div>
            <ChevronRight class="h-4 w-4 text-text-muted" />
          </router-link>
        </template>
      </div>

      <!-- Logout: subdued -->
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-transparent py-3 text-sm text-text-muted transition-colors duration-200 hover:border-border hover:text-text-secondary cursor-pointer"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" />
        退出登录
      </button>
    </div>

    <!-- Wallet Modal -->
    <Teleport to="body">
      <div
        v-if="showWalletModal"
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="showWalletModal = false"
      >
        <div class="w-full max-w-sm rounded-2xl bg-bg-card p-5 shadow-2xl">
          <!-- Header -->
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-base font-semibold">
              {{ walletModalMode === 'bind' ? '绑定钱包地址' : '提现 USDT' }}
            </h3>
            <button
              class="text-text-muted hover:text-text-primary cursor-pointer"
              @click="showWalletModal = false"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Bind Wallet Mode -->
          <div v-if="walletModalMode === 'bind'" class="space-y-4">
            <div>
              <label class="mb-2 block text-xs font-medium text-text-secondary"
                >TRC20 钱包地址</label
              >
              <input
                v-model="walletForm.address"
                type="text"
                placeholder="请输入 TRC20 地址（以 T 开头）"
                class="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-2 block text-xs font-medium text-text-secondary">登录密码</label>
              <input
                v-model="walletForm.password"
                type="password"
                placeholder="请输入登录密码"
                class="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
              />
            </div>
            <button
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-medium text-bg-primary transition-colors hover:bg-gold-light cursor-pointer"
              @click="confirmWalletAction"
            >
              确认绑定
            </button>
          </div>

          <!-- Withdraw Mode -->
          <div v-else class="space-y-4">
            <div class="rounded-xl border border-gold/20 bg-gold/5 p-4">
              <p class="text-xs text-text-secondary mb-1">可提现余额</p>
              <p class="text-2xl font-bold text-gold">
                {{ userStore.currentUser?.balance ?? 0 }} USDT
              </p>
            </div>
            <div>
              <label class="mb-2 block text-xs font-medium text-text-secondary">提现金额</label>
              <input
                v-model="walletForm.amount"
                type="number"
                placeholder="请输入提现金额"
                class="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-2 block text-xs font-medium text-text-secondary">登录密码</label>
              <input
                v-model="walletForm.password"
                type="password"
                placeholder="请输入登录密码"
                class="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div v-if="userStore.currentUser?.walletAddress" class="rounded-lg bg-bg-secondary p-3">
              <p class="text-xs text-text-muted">提现至</p>
              <p class="font-mono text-xs text-text-primary mt-1">
                {{ maskAddress(userStore.currentUser?.walletAddress) }}
              </p>
            </div>
            <button
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-medium text-bg-primary transition-colors hover:bg-gold-light cursor-pointer"
              @click="confirmWalletAction"
            >
              确认提现
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
