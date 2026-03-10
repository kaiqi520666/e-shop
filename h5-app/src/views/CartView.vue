<script setup>
import { inject, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAppStore } from '@/stores/app'
import { formatPrice } from '@/utils'

import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading.vue'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const appStore = useAppStore()
const toast = inject('toast')

function getPriceUSDT(item) {
  return appStore.usdt_rate ? item.priceRMB / appStore.usdt_rate : 0
}

function removeItem(id) {
  cartStore.removeItem(id)
  toast.info('已移除商品')
}

function checkout() {
  if (cartStore.items.length === 0) return
  router.push('/checkout')
}

// 页面加载时获取购物车数据
onMounted(() => {
  if (appStore.configList.length === 0) {
    appStore.fetchConfigList()
  }
  cartStore.fetchCart()
})
</script>

<template>
  <div>
    <Loading :visible="cartStore.loading" />

    <div v-if="cartStore.items.length" class="space-y-4 px-4 py-4 pb-32">
      <div
        v-for="item in cartStore.items"
        :key="item.productId"
        class="flex gap-4 rounded-xl border border-border bg-bg-card p-4 shadow-sm transition-colors duration-200 hover:border-gold/10"
      >
        <router-link
          :to="`/product/${item.productId}`"
          class="h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-border bg-bg-secondary transition-opacity duration-200 hover:ring-gold/30"
        >
          <img
            :src="item.image"
            :alt="item.name"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </router-link>

        <div class="flex min-w-0 flex-1 flex-col justify-between">
          <div class="flex items-start justify-between gap-2">
            <router-link
              :to="`/product/${item.productId}`"
              class="min-w-0 flex-1 truncate font-medium text-text-primary transition-colors duration-200 hover:text-gold cursor-pointer"
            >
              {{ item.name }}
            </router-link>
            <button
              class="shrink-0 rounded-full p-1.5 text-text-muted transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              aria-label="删除商品"
              @click="removeItem(item.id)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-2 flex flex-col gap-2">
            <div class="flex items-end justify-between">
              <div>
                <p class="text-lg font-bold text-gold">{{ formatPrice(getPriceUSDT(item)) }}</p>
                <p class="text-xs text-text-muted">
                  {{ formatPrice(item.priceRMB, 'RMB') }}
                </p>
              </div>
              <p class="text-right text-sm font-medium text-gold">
                小计 {{ formatPrice(getPriceUSDT(item) * item.quantity) }}
              </p>
            </div>

            <div class="flex items-center justify-end gap-1">
              <button
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-secondary text-gold transition-colors duration-200 hover:border-gold/30 disabled:opacity-40 cursor-pointer"
                :disabled="item.quantity <= 1"
                @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                aria-label="减少数量"
              >
                <Minus class="h-3.5 w-3.5" />
              </button>
              <span class="min-w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
              <button
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-secondary text-gold transition-colors duration-200 hover:border-gold/30 disabled:opacity-40 cursor-pointer"
                :disabled="item.quantity >= item.stock"
                @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                aria-label="增加数量"
              >
                <Plus class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="fixed bottom-12 left-0 right-0 z-40 border-t border-gold/20 bg-bg-primary/95 shadow-[0_-4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm"
      >
        <div
          class="mx-auto flex max-w-md items-center justify-between px-4 py-4 md:max-w-lg lg:max-w-xl"
        >
          <div>
            <p class="text-xs text-text-secondary">共 {{ cartStore.itemCount }} 件商品</p>
            <p class="text-xl font-bold text-gold">
              {{ formatPrice(cartStore.totalUSDT) }}
            </p>
          </div>
          <button
            class="rounded-xl bg-gold px-8 py-2.5 text-sm font-medium text-bg-primary shadow-[0_0_12px_rgba(201,168,76,0.3)] transition-colors duration-200 hover:bg-gold-light cursor-pointer"
            @click="checkout"
          >
            去结算
          </button>
        </div>
      </div>
    </div>

    <Empty v-else text="购物车是空的" :icon="ShoppingCart">
      <router-link
        to="/"
        class="mt-4 rounded-lg bg-gold px-6 py-2 text-sm text-bg-primary transition-colors duration-200 hover:bg-gold-light cursor-pointer"
      >
        去逛逛
      </router-link>
    </Empty>
  </div>
</template>
