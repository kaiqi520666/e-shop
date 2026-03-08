<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticeStore } from '@/stores/notice'
import Header from '@/components/layout/Header.vue'
import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading.vue'
import { Bell, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const noticeStore = useNoticeStore()

const refreshing = ref(false)

onMounted(() => {
  noticeStore.fetchNotices()
})

async function onRefresh() {
  refreshing.value = true
  await noticeStore.fetchNotices()
  refreshing.value = false
}

function goToDetail(id) {
  router.push(`/notices/${id}`)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div>
    <Header title="公告列表" show-back />

    <Loading :visible="noticeStore.loading && !refreshing" />

    <div v-if="noticeStore.noticeList.length" class="px-4 py-4 space-y-3">
      <div
        v-for="notice in noticeStore.noticeList"
        :key="notice.id"
        class="group rounded-xl border border-border bg-bg-card p-4 transition-all duration-200 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(201,168,76,0.08)] cursor-pointer"
        @click="goToDetail(notice.id)"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
            <Bell class="h-5 w-5 text-gold" />
          </div>
          <div class="flex-1 min-w-0">
            <h3
              class="font-medium text-text-primary truncate group-hover:text-gold transition-colors"
            >
              {{ notice.title }}
            </h3>
            <p class="mt-1 text-xs text-text-muted">
              {{ formatDate(notice.createTime) }}
            </p>
          </div>
          <ChevronRight
            class="h-4 w-4 shrink-0 text-text-muted group-hover:text-gold transition-colors"
          />
        </div>
      </div>
    </div>

    <Empty v-else-if="!noticeStore.loading" text="暂无公告" :icon="Bell">
      <p class="mt-2 text-sm text-text-muted">敬请期待更多精彩内容</p>
    </Empty>

    <!-- 下拉刷新提示 -->
    <div v-if="refreshing" class="py-8 text-center text-sm text-text-muted">刷新中...</div>
  </div>
</template>
