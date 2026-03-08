<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAddressStore } from '@/stores/address'
import { useUserStore } from '@/stores/user'
import { orderApi } from '@/api/modules/shop/order.api'
import { formatPrice } from '@/utils'
import { walletAddress } from '@/mock/data'
import Header from '@/components/layout/Header.vue'
import Loading from '@/components/common/Loading.vue'
import { MapPin, ChevronRight, Copy, QrCode, Wallet, CreditCard } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const addressStore = useAddressStore()
const userStore = useUserStore()
const toast = inject('toast')

const loading = ref(false)
const showAddressPicker = ref(false)
const paymentMethod = ref('balance') // 'balance' | 'usdt'

const selectedAddress = ref(null)

// 页面加载时获取地址列表
onMounted(async () => {
  await addressStore.fetchAddressList()
  selectedAddress.value = addressStore.defaultAddress
})

const balance = computed(() => userStore.currentUser?.balance ?? 0)
const totalUSDT = computed(() => cartStore.totalUSDT)
const canUseBalance = computed(() => balance.value >= totalUSDT.value && totalUSDT.value > 0)

watch(
  canUseBalance,
  (ok) => {
    if (!ok && paymentMethod.value === 'balance') paymentMethod.value = 'usdt'
  },
  { immediate: true },
)

function selectAddress(addr) {
  selectedAddress.value = addr
  showAddressPicker.value = false
}

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

const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${walletAddress}`

async function submitOrder() {
  if (!selectedAddress.value) {
    return toast.error('请先添加收货地址')
  }
  if (cartStore.items.length === 0) {
    return toast.error('购物车为空')
  }

  loading.value = true
  try {
    const addr =
      selectedAddress.value.address ||
      selectedAddress.value.detail ||
      [
        selectedAddress.value.province,
        selectedAddress.value.city,
        selectedAddress.value.district,
        selectedAddress.value.detail,
      ]
        .filter(Boolean)
        .join('')

    const res = await orderApi.createOrder({
      phone: selectedAddress.value.phone,
      address: addr,
      contact: selectedAddress.value.contact || selectedAddress.value.name,
    })

    if (res.code === 1000) {
      cartStore.clearCart()
      // 更新用户余额
      await userStore.fetchUserInfo()
      router.replace({
        name: 'orderSuccess',
        query: {
          orderNo: res.data.orderNo,
          total: res.data.totalUSDT,
          address: addr,
        },
      })
    } else {
      toast.error(res.message || '创建订单失败')
    }
  } catch (error) {
    toast.error(error.message || '创建订单失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pb-24">
    <Header title="确认订单" show-back />
    <Loading :visible="loading" />

    <!-- Address Section -->
    <div class="px-4 pt-4">
      <div
        v-if="selectedAddress"
        class="rounded-xl border border-border bg-bg-card p-4 cursor-pointer transition-colors duration-200 hover:border-gold/30"
        @click="showAddressPicker = true"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-2">
            <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <div>
              <p class="text-sm font-medium">
                {{ selectedAddress.contact || selectedAddress.name }}
                <span class="ml-2 text-text-secondary">{{ selectedAddress.phone }}</span>
              </p>
              <p class="mt-1 text-xs text-text-secondary">
                {{
                  selectedAddress.address ||
                  selectedAddress.detail ||
                  [
                    selectedAddress.province,
                    selectedAddress.city,
                    selectedAddress.district,
                    selectedAddress.detail,
                  ]
                    .filter(Boolean)
                    .join('')
                }}
              </p>
            </div>
          </div>
          <ChevronRight class="h-4 w-4 shrink-0 text-text-muted" />
        </div>
      </div>
      <router-link
        v-else
        to="/address/form"
        class="flex items-center justify-between rounded-xl border border-dashed border-border bg-bg-card p-4 text-sm text-text-secondary transition-colors duration-200 hover:border-gold/30 cursor-pointer"
      >
        <span class="flex items-center gap-2">
          <MapPin class="h-4 w-4 text-gold" />
          添加收货地址
        </span>
        <ChevronRight class="h-4 w-4 text-text-muted" />
      </router-link>
    </div>

    <!-- Order Items -->
    <div class="mt-4 px-4">
      <h3 class="mb-3 text-sm font-medium text-text-secondary">商品列表</h3>
      <div class="rounded-xl border border-border bg-bg-card divide-y divide-border">
        <div v-for="item in cartStore.items" :key="item.productId" class="flex gap-3 p-3">
          <div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg-secondary">
            <img
              :src="item.image"
              :alt="item.name"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="flex min-w-0 flex-1 items-center justify-between">
            <div class="min-w-0">
              <p class="truncate text-sm">{{ item.name }}</p>
              <p class="text-xs text-text-muted">x{{ item.quantity }}</p>
            </div>
            <p class="shrink-0 text-sm font-bold text-gold">
              {{ formatPrice(item.priceUSDT * item.quantity) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="mt-4 px-4">
      <h3 class="mb-3 text-sm font-medium text-text-secondary">支付方式</h3>
      <div
        class="rounded-xl border border-border bg-bg-card divide-y divide-border overflow-hidden"
      >
        <label
          v-if="canUseBalance"
          class="flex cursor-pointer items-center gap-3 p-4 transition-colors duration-200 hover:bg-bg-secondary"
          :class="{ 'bg-gold/10': paymentMethod === 'balance' }"
        >
          <input
            v-model="paymentMethod"
            type="radio"
            value="balance"
            class="h-4 w-4 border-border text-gold focus:ring-gold"
          />
          <Wallet class="h-5 w-5 text-gold" />
          <div class="flex-1">
            <p class="text-sm font-medium">余额支付</p>
            <p class="text-xs text-text-muted">可用 {{ formatPrice(balance) }}</p>
          </div>
          <span class="text-sm font-bold text-gold">-{{ formatPrice(totalUSDT) }}</span>
        </label>
        <label
          class="flex cursor-pointer items-center gap-3 p-4 transition-colors duration-200 hover:bg-bg-secondary"
          :class="{ 'bg-gold/10': paymentMethod === 'usdt' }"
        >
          <input
            v-model="paymentMethod"
            type="radio"
            value="usdt"
            class="h-4 w-4 border-border text-gold focus:ring-gold"
          />
          <CreditCard class="h-5 w-5 text-gold" />
          <div class="flex-1">
            <p class="text-sm font-medium">USDT 扫码</p>
            <p class="text-xs text-text-muted">TRC20 转账</p>
          </div>
        </label>
      </div>

      <!-- USDT QR (only when USDT selected) -->
      <div
        v-if="paymentMethod === 'usdt'"
        class="mt-4 rounded-xl border border-border bg-bg-card p-4"
      >
        <p class="mb-3 text-xs text-text-muted">请按实际金额转账，完成后点击确认下单</p>
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

      <div v-if="!canUseBalance" class="mt-2 text-xs text-text-muted">
        余额不足，请先
        <router-link to="/recharge" class="text-gold cursor-pointer">充值</router-link>
        或选择 USDT 扫码支付
      </div>
    </div>

    <!-- Submit Button -->
    <div
      class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/95 backdrop-blur-sm"
    >
      <div
        class="mx-auto flex max-w-md items-center justify-between px-4 py-3 md:max-w-lg lg:max-w-xl"
      >
        <div>
          <p class="text-xs text-text-secondary">应付</p>
          <p class="text-lg font-bold text-gold">{{ formatPrice(cartStore.totalUSDT) }}</p>
        </div>
        <button
          :disabled="loading || !cartStore.items.length"
          class="rounded-lg bg-gold px-8 py-2.5 text-sm font-medium text-bg-primary transition-colors duration-200 hover:bg-gold-light disabled:opacity-50 cursor-pointer"
          @click="submitOrder"
        >
          确认下单
        </button>
      </div>
    </div>

    <!-- Address Picker Modal -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="showAddressPicker"
          class="fixed inset-0 z-80 bg-black/60 backdrop-blur-sm"
          @click="showAddressPicker = false"
        />
      </transition>
      <transition name="slide-up">
        <div
          v-if="showAddressPicker"
          class="fixed bottom-0 left-0 right-0 z-81 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-bg-card"
        >
          <div
            class="sticky top-0 flex items-center justify-between border-b border-border bg-bg-card px-4 py-3"
          >
            <h3 class="text-sm font-medium">选择收货地址</h3>
            <button
              class="text-xs text-text-secondary cursor-pointer"
              @click="showAddressPicker = false"
            >
              关闭
            </button>
          </div>
          <div v-if="addressStore.addressList.length" class="divide-y divide-border">
            <div
              v-for="addr in addressStore.addressList"
              :key="addr.id"
              class="flex items-start gap-3 px-4 py-3 transition-colors duration-200 hover:bg-bg-secondary cursor-pointer"
              @click="selectAddress(addr)"
            >
              <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <p class="text-sm">
                  {{ addr.contact || addr.name }}
                  <span class="ml-2 text-text-secondary">{{ addr.phone }}</span>
                  <span
                    v-if="addr.isDefault"
                    class="ml-2 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold"
                    >默认</span
                  >
                </p>
                <p class="mt-0.5 text-xs text-text-secondary">
                  {{
                    addr.address ||
                    addr.detail ||
                    [addr.province, addr.city, addr.district, addr.detail].filter(Boolean).join('')
                  }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="py-10 text-center text-sm text-text-muted">
            <p>暂无地址</p>
            <router-link to="/address/form" class="mt-2 inline-block text-gold cursor-pointer"
              >去添加</router-link
            >
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active {
  transition: transform 0.3s ease-out;
}
.slide-up-leave-active {
  transition: transform 0.2s ease-in;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
