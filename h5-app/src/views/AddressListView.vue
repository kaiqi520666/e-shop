<script setup>
import { inject, onMounted } from 'vue'
import { useAddressStore } from '@/stores/address'
import Header from '@/components/layout/Header.vue'
import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading.vue'
import { MapPin, Edit3, Trash2, Star, Plus } from 'lucide-vue-next'

const addressStore = useAddressStore()
const toast = inject('toast')

onMounted(() => {
  addressStore.fetchAddressList()
})

async function removeAddress(id) {
  const result = await addressStore.remove(id)
  if (result.success) {
    toast.info('地址已删除')
  } else {
    toast.error(result.message)
  }
}

async function setDefault(id) {
  const result = await addressStore.setDefault(id)
  if (result.success) {
    toast.success('已设为默认地址')
  } else {
    toast.error(result.message)
  }
}

function getDisplayName(addr) {
  return addr.contact || addr.name || ''
}

function getDisplayDetail(addr) {
  return addr.address || addr.detail || ''
}
</script>

<template>
  <div>
    <Header title="地址管理" show-back />
    <Loading :visible="addressStore.loading" />

    <div v-if="addressStore.addressList.length" class="px-4 py-4 space-y-3 pb-24">
      <div
        v-for="addr in addressStore.addressList"
        :key="addr.id"
        class="rounded-xl border bg-bg-card p-4 transition-colors duration-200"
        :class="addr.isDefault ? 'border-gold/30' : 'border-border'"
      >
        <div class="mb-2 flex items-start justify-between">
          <div>
            <span class="text-sm font-medium">{{ getDisplayName(addr) }}</span>
            <span class="ml-2 text-sm text-text-secondary">{{ addr.phone }}</span>
            <span v-if="addr.isDefault" class="ml-2 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">默认</span>
          </div>
        </div>
        <p class="mb-3 text-xs text-text-secondary">
          {{ getDisplayDetail(addr) }}
        </p>
        <div class="flex items-center gap-4 border-t border-border pt-3">
          <button
            v-if="!addr.isDefault"
            class="flex items-center gap-1 text-xs text-text-muted transition-colors duration-200 hover:text-gold cursor-pointer"
            @click="setDefault(addr.id)"
          >
            <Star class="h-3.5 w-3.5" />
            设为默认
          </button>
          <router-link
            :to="`/address/form/${addr.id}`"
            class="flex items-center gap-1 text-xs text-text-muted transition-colors duration-200 hover:text-gold cursor-pointer"
          >
            <Edit3 class="h-3.5 w-3.5" />
            编辑
          </router-link>
          <button
            class="flex items-center gap-1 text-xs text-text-muted transition-colors duration-200 hover:text-red-400 cursor-pointer"
            @click="removeAddress(addr.id)"
          >
            <Trash2 class="h-3.5 w-3.5" />
            删除
          </button>
        </div>
      </div>
    </div>

    <Empty v-else-if="!addressStore.loading" text="暂无收货地址" :icon="MapPin" />

    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg-primary/95 px-4 py-3 backdrop-blur-sm">
      <div class="mx-auto max-w-md md:max-w-lg lg:max-w-xl">
        <router-link
          to="/address/form"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-medium text-bg-primary transition-colors duration-200 hover:bg-gold-light cursor-pointer"
          :class="{ 'opacity-50 pointer-events-none': addressStore.addressList.length >= 10 }"
        >
          <Plus class="h-4 w-4" />
          新增地址
        </router-link>
        <p v-if="addressStore.addressList.length >= 10" class="mt-2 text-center text-xs text-text-muted">已达上限 10 条</p>
      </div>
    </div>
  </div>
</template>
