<script setup>
import { computed, ref, inject, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Header from '@/components/layout/Header.vue'
import RebateModal from '@/components/common/RebateModal.vue'
import { Wallet, FileText, Settings } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const toast = inject('toast')

const loading = ref(false)
const rebateModalVisible = ref(false)
const selectedMember = ref(null)

// 从 API 获取团队成员
const teamMembers = ref([])

async function fetchTeamMembers() {
  loading.value = true
  try {
    teamMembers.value = await userStore.fetchTeam()
  } catch (error) {
    console.error('获取团队成员失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTeamMembers()
})

// 按层级分组
const groupedByLevel = computed(() => {
  const groups = {}
  teamMembers.value.forEach((m) => {
    if (!groups[m.level]) groups[m.level] = []
    groups[m.level].push(m)
  })
  return groups
})

// 层级 tabs（按 level 排序）
const levelTabs = computed(() => {
  return Object.keys(groupedByLevel.value)
    .map(Number)
    .sort((a, b) => a - b)
})

// 当前选中的层级，默认一级
const activeLevel = ref(1)

const currentLevelMembers = computed(() => {
  return groupedByLevel.value[activeLevel.value] || []
})

// 当前用户的返点
const currentUserRebate = computed(() => {
  return Number(userStore.currentUser?.commissionRate) || 0
})

// 监听 levelTabs 变化，更新 activeLevel
watch(
  () => levelTabs.value,
  (tabs) => {
    if (tabs.length > 0 && !tabs.includes(activeLevel.value)) {
      activeLevel.value = tabs[0]
    }
  },
  { immediate: true },
)

function selectLevel(level) {
  activeLevel.value = level
}

function goToTransactions() {
  router.push('/transactions')
}

// 打开返点设置弹窗
function openRebateModal(member) {
  if (member.level !== 1) {
    toast.info('只能设置直属下级（1级）的返点')
    return
  }
  selectedMember.value = member
  rebateModalVisible.value = true
}

// 确认设置返点
async function handleRebateConfirm({ uid, rebate }) {
  const result = await userStore.setSubRate(uid, Number(rebate))
  if (result.success) {
    // 更新本地数据
    const memberIndex = teamMembers.value.findIndex((m) => m.id === uid)
    if (memberIndex !== -1) {
      teamMembers.value[memberIndex].commissionRate = String(rebate)
    }
    toast.success(`已设置返点为 ${rebate}%`)
  } else {
    toast.error(result.message || '设置失败')
  }
}
</script>

<template>
  <div class="pb-24">
    <Header title="代理中心" show-back />

    <div class="px-4 pt-4">
      <!-- Commission balance -->
      <div class="mb-6 rounded-xl border border-gold/30 bg-linear-to-br from-gold/10 to-gold/5 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
              <Wallet class="h-5 w-5 text-gold" />
            </div>
            <div>
              <p class="text-xs text-text-secondary">可提现佣金</p>
              <p class="text-2xl font-bold text-gold">
                {{ Number(userStore.currentUser?.balance ?? 0).toFixed(4) }} USDT
              </p>
              <p class="mt-0.5 text-xs text-text-muted">
                累计收入 {{ Number(userStore.currentUser?.totalIncome ?? 0).toFixed(4) }} USDT
              </p>
            </div>
          </div>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg bg-gold/20 px-4 py-2.5 text-sm font-medium text-gold transition-colors duration-200 hover:bg-gold/30 cursor-pointer"
            @click="goToTransactions"
          >
            <FileText class="h-4 w-4" />
            明细
          </button>
        </div>
      </div>

      <!-- Team list with Tabs -->
      <div class="mb-6 rounded-xl border border-border bg-bg-card">
        <div class="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 class="font-heading text-sm font-medium text-text-primary">我的团队</h3>
          <div class="flex items-center gap-2">
            <span class="text-xs text-text-muted">自身返点</span>
            <span class="text-sm font-medium text-gold">{{ currentUserRebate }}%</span>
          </div>
        </div>

        <!-- Level Tabs -->
        <div
          v-if="levelTabs.length > 0"
          class="flex gap-2 border-b border-border px-4 py-2 overflow-x-auto"
        >
          <button
            v-for="level in levelTabs"
            :key="level"
            type="button"
            class="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer"
            :class="
              activeLevel === level
                ? 'bg-gold text-bg-primary'
                : 'bg-bg-secondary text-text-secondary hover:bg-gold/10 hover:text-gold'
            "
            @click="selectLevel(level)"
          >
            {{ level }}级 ({{ groupedByLevel[level]?.length || 0 }}人)
          </button>
        </div>

        <!-- Member List -->
        <div
          v-if="currentLevelMembers.length === 0"
          class="px-4 py-8 text-center text-sm text-text-muted"
        >
          暂无下级成员，邀请好友加入吧
        </div>
        <div v-else class="divide-y divide-border">
          <div
            v-for="member in currentLevelMembers"
            :key="member.id"
            class="flex items-center justify-between px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
                <span class="text-sm font-medium text-gold">{{
                  member.username?.charAt(0) ?? '?'
                }}</span>
              </div>
              <div>
                <p class="text-sm font-medium">{{ member.username }}</p>
                <p class="text-xs text-text-muted">{{ member.phone }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-xs text-text-muted">{{ member.createTime }}</p>
                <p class="text-xs text-gold">返点 {{ member.commissionRate }}%</p>
              </div>
              <button
                v-if="member.level === 1"
                type="button"
                class="rounded-lg p-1.5 text-text-muted hover:bg-gold/10 hover:text-gold cursor-pointer"
                title="设置返点"
                @click="openRebateModal(member)"
              >
                <Settings class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 返点设置弹窗 -->
    <RebateModal
      v-model:visible="rebateModalVisible"
      :member="selectedMember"
      :max-rebate="currentUserRebate"
      @confirm="handleRebateConfirm"
    />
  </div>
</template>
