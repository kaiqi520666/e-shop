<script setup>
import { inject, computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from '@/components/layout/BottomNav.vue'
import Toast from '@/components/common/Toast.vue'

const route = useRoute()
const toastState = inject('toastState')

const hideBottomNav = computed(() =>
  [
    'login',
    'register',
    'product',
    'checkout',
    'orderSuccess',
    'orderList',
    'orderDetail',
    'addressForm',
    'addressList',
    'recharge',
    'withdraw',
    'agent',
    'transactions',
    'noticeDetail',
  ].includes(route.name),
)
</script>

<template>
  <div class="min-h-dvh bg-bg-primary font-body text-text-primary">
    <div class="mx-auto max-w-md md:max-w-lg lg:max-w-xl relative min-h-dvh pb-18">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <BottomNav v-if="!hideBottomNav" />
    </div>
    <Toast :visible="toastState.visible" :message="toastState.message" :type="toastState.type" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
