<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingStore, useUserStore } from '@/stores'
import BottomBar from '@/components/BottomBar.vue'
import AppToast from '@/components/AppToast.vue'
import GlobalLoading from '@/components/GlobalLoading.vue'
import GlobalConfirm from '@/components/GlobalConfirm.vue'
import PageSkeleton from '@/components/PageSkeleton.vue'

const route = useRoute()
const userStore = useUserStore()
const loadingStore = useLoadingStore()

const showBottomBar = computed(() => {
  const showPaths = ['/', '/notice', '/orders', '/profile']
  return showPaths.includes(route.path)
})

const shouldRefreshOnEnter = (path) => {
  const keyPaths = [
    '/',
    '/orders',
    '/profile',
    '/agent',
    '/recharge',
    '/withdraw',
    '/wallet',
    '/records',
  ]
  return keyPaths.includes(path) || path.startsWith('/orders/')
}

watch(
  () => route.fullPath,
  async () => {
    if (!userStore.currentUser?.token) {
      return
    }

    if (shouldRefreshOnEnter(route.path)) {
      await userStore.refreshUserInfoSilently()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-screen bg-[#0e1316] text-white" :class="{ 'pb-16': showBottomBar }">
    <RouterView />
    <BottomBar v-if="showBottomBar" />
    <PageSkeleton :visible="loadingStore.pageLoading" :with-bottom-bar="showBottomBar" />
    <AppToast />
    <GlobalLoading />
    <GlobalConfirm />
  </div>
</template>
