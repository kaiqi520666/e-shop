<template>
  <div class="p-4 pt-22">
    <PageHeader title="钱包地址" />

    <GlowCard class="mb-6">
      <div class="mb-4 flex items-center justify-between">
        <span class="text-sm text-gray-400">当前地址 (TRC-20)</span>
        <div class="flex items-center gap-1 rounded bg-[#00FFA3]/10 px-2 py-0.5 text-xs text-[#00FFA3]">
          <Wallet class="h-3 w-3" />
          <span>USDT</span>
        </div>
      </div>

      <div v-if="walletAddress" class="space-y-4">
        <div class="rounded-lg border border-[#334155] bg-[#121212] p-3">
          <div class="mb-2 text-xs text-gray-400">钱包地址</div>
          <div class="break-all font-mono text-sm text-white">{{ walletAddress }}</div>
        </div>

        <div class="flex gap-3">
          <button @click="copyAddress" class="flex-1 rounded-xl bg-[#00FFA3]/10 py-3 font-medium text-[#00FFA3]">复制地址</button>
          <button @click="startEdit" class="flex-1 rounded-xl bg-white/10 py-3 font-medium text-white">修改地址</button>
        </div>
      </div>

      <div v-else class="py-4 text-center">
        <div class="mb-4 text-gray-500">暂未绑定钱包地址</div>
        <button @click="startAdd" class="inline-flex items-center gap-2 rounded-xl bg-[#00FFA3] px-6 py-3 font-medium text-[#121212]">
          <Plus class="h-4 w-4" />
          绑定钱包地址
        </button>
      </div>
    </GlowCard>

    <div v-if="isEditing" class="rounded-xl border border-[#334155] bg-white/5 p-5 backdrop-blur-md">
      <div class="mb-4 flex items-center gap-3">
        <div class="h-5 w-1 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]"></div>
        <span class="font-medium text-white">{{ isAdding ? '绑定新地址' : '修改地址' }}</span>
      </div>

      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm text-gray-400">钱包地址 (TRC-20)</label>
          <input v-model="newAddress" type="text" placeholder="请输入 TRC-20 钱包地址" class="input-field" />
        </div>

        <div class="flex gap-3">
          <button @click="cancelEdit" class="flex-1 rounded-xl bg-white/10 py-3 font-medium text-white">取消</button>
          <button @click="saveAddress" class="flex-1 rounded-xl bg-[#00FFA3] py-3 font-medium text-[#121212]">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import GlowCard from '@/components/GlowCard.vue'
import { useUserStore } from '@/stores'
import { Wallet, Plus } from 'lucide-vue-next'
import { useUi } from '@/composables/useUi'
import { copyText } from '@/utils/clipboard'

const userStore = useUserStore()
const { toast } = useUi()

const walletAddress = ref(userStore.currentUser.walletAddress || '')
const isEditing = ref(false)
const isAdding = ref(false)
const newAddress = ref('')

const startAdd = () => {
  isAdding.value = true
  isEditing.value = true
  newAddress.value = ''
}

const startEdit = () => {
  isAdding.value = false
  isEditing.value = true
  newAddress.value = walletAddress.value
}

const cancelEdit = () => {
  isEditing.value = false
  newAddress.value = ''
}

const saveAddress = async () => {
  if (!newAddress.value) {
    toast.warning('请输入钱包地址')
    return
  }
  if (newAddress.value.length < 20) {
    toast.error('钱包地址格式不正确')
    return
  }

  walletAddress.value = newAddress.value
  await userStore.updateUser({ walletAddress: newAddress.value })
  isEditing.value = false
  newAddress.value = ''
  toast.success(isAdding.value ? '地址绑定成功' : '地址修改成功')
}

const copyAddress = async () => {
  const copied = await copyText(walletAddress.value)
  if (copied) {
    toast.success('地址已复制')
  } else {
    toast.error('复制失败，请手动长按地址复制')
  }
}
</script>
