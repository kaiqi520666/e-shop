<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNoticeStore } from '@/stores/notice'
import Header from '@/components/layout/Header.vue'
import Loading from '@/components/common/Loading.vue'

const route = useRoute()
const noticeStore = useNoticeStore()

const notice = ref(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id
  notice.value = await noticeStore.getNoticeById(id)
  loading.value = false
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div>
    <Header title="公告详情" show-back />

    <Loading :visible="loading" />

    <div v-if="notice" class="px-4 py-5">
      <!-- 标题 -->
      <h1 class="text-xl font-bold text-text-primary">{{ notice.title }}</h1>
      
      <!-- 发布时间 -->
      <div class="mt-3 flex items-center gap-2 text-xs text-text-muted">
        <span>发布时间：{{ formatDate(notice.createTime) }}</span>
      </div>
      
      <!-- 分割线 -->
      <div class="my-5 h-px bg-linear-to-r from-gold/30 via-gold/10 to-transparent" />
      
      <!-- 内容 -->
      <div 
        class="prose prose-sm max-w-none text-text-secondary leading-relaxed"
        v-html="notice.content"
      />
    </div>

    <!-- 404 -->
    <div v-else-if="!loading" class="px-4 py-10 text-center">
      <p class="text-text-muted">公告不存在或已被删除</p>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(p) {
  margin-bottom: 1em;
}
.prose :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
