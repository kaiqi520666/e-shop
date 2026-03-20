<template>
  <div class="p-4 pt-22">
    <PageHeader title="代理中心" />

    <GlowCard padding="p-4" class="mb-4">
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-[#F59E0B]/10 p-2">
            <Crown class="h-5 w-5 text-[#F59E0B]" />
          </div>
          <span class="font-bold text-[#F59E0B]">{{ userStore.currentUser?.commissionRate }}% 返点</span>
        </div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">邀请码：{{ userStore.currentUser?.inviteCode }}</span>
        <button @click="copyInviteCode" class="text-[#00FFA3]">复制</button>
      </div>
    </GlowCard>

    <TabBar v-model="currentTab" :tabs="tabs" />

    <div class="mb-4 space-y-3">
      <div v-for="agent in filteredAgents" :key="agent.id" class="rounded-xl border border-[#334155] bg-white/5 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <User class="h-4 w-4 text-gray-400" />
            <span class="font-medium text-white">{{ agent.username }}</span>
            <span class="text-sm text-gray-400">{{ agent.phone }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[#F59E0B]">{{ agent.commissionRate }}%</span>
            <button v-if="agent.level === 1" @click="openSetModal(agent)" class="text-sm text-[#00FFA3]">设置</button>
          </div>
        </div>
      </div>

      <div v-if="filteredAgents.length === 0" class="py-8 text-center text-gray-500">暂无代理数据</div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showModal = false">
      <div class="w-full max-w-sm rounded-xl border border-[#334155] bg-[#1a1a2e] p-6">
        <h3 class="mb-4 font-bold text-white">设置返点</h3>
        <div class="mb-4 text-sm text-gray-400">
          为 {{ selectedAgent?.username }} 设置返点，当前 {{ selectedAgent?.commissionRate }}%，最高 {{ userStore.currentUser?.commissionRate }}%
        </div>
        <input
          v-model="newRate"
          type="number"
          step="0.1"
          min="0"
          :max="userStore.currentUser?.commissionRate"
          class="mb-2 w-full rounded-lg border border-[#334155] bg-white/10 px-4 py-3 text-white outline-none"
          placeholder="请输入返点比例"
        />
        <div class="mb-4 text-xs text-gray-500">
          可输入范围：{{ selectedAgent?.commissionRate || 0 }}% ~ {{ userStore.currentUser?.commissionRate }}%
        </div>
        <div class="flex gap-3">
          <button @click="showModal = false" class="flex-1 rounded-lg bg-white/10 py-2 text-white">取消</button>
          <button @click="confirmSetRate" class="flex-1 rounded-lg bg-[#00FFA3] py-2 font-medium text-[#121212]">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { User, Crown } from 'lucide-vue-next'
import { useUserStore } from '@/stores'
import { useUi } from '@/composables/useUi'
import PageHeader from '@/components/PageHeader.vue'
import GlowCard from '@/components/GlowCard.vue'
import TabBar from '@/components/TabBar.vue'

const userStore = useUserStore()
const { toast } = useUi()

const currentTab = ref('')
const showModal = ref(false)
const selectedAgent = ref(null)
const newRate = ref(0)
const teamMember = ref([])

onMounted(async () => {
  const res = await userStore.getTeamMember()
  teamMember.value = res.data || []
  await nextTick()
  if (tabs.value.length > 0) {
    currentTab.value = tabs.value[0].value
  }
})

const tabs = computed(() => {
  const levels = [...new Set(teamMember.value.map((item) => item.level))].sort((a, b) => a - b)
  return levels.map((level) => ({ value: level, label: `${level}级` }))
})

const filteredAgents = computed(() => teamMember.value.filter((item) => item.level === currentTab.value))

const copyInviteCode = () => userStore.copyInviteCode()

const openSetModal = (agent) => {
  selectedAgent.value = agent
  newRate.value = String(agent.commissionRate)
  showModal.value = true
}

const confirmSetRate = async () => {
  if (!selectedAgent.value) return

  const rate = parseFloat(newRate.value)
  const maxRate = parseFloat(userStore.currentUser?.commissionRate) || 10
  const minRate = parseFloat(selectedAgent.value.commissionRate) || 0

  if (Number.isNaN(rate) || rate < minRate || rate > maxRate) {
    toast.warning(`返点必须在 ${minRate}% ~ ${maxRate}% 之间`)
    return
  }

  await userStore.setSubRate({
    subUserId: selectedAgent.value.id,
    rate,
  })
  selectedAgent.value.commissionRate = String(rate)
  toast.success('设置成功')
  showModal.value = false
}
</script>
