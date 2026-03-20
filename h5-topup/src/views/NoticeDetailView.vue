<template>
  <div class="p-4 pt-22">
    <PageHeader title="公告详情" />

    <div v-if="loading" class="py-20 text-center text-sm text-gray-400">公告详情加载中...</div>

    <div v-else-if="errorMessage" class="py-20 text-center">
      <EmptyState :icon="Bell" text="公告加载失败" />
      <button class="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm text-white" @click="loadNotice">
        重新加载
      </button>
    </div>

    <div v-else-if="notice" class="space-y-5">
      <div
        class="relative overflow-hidden rounded-3xl border border-[#334155] bg-linear-to-br from-[#121b2d] via-[#101622] to-[#0c1017] p-5"
      >
        <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#00FFA3]/15 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#3B82F6]/10 blur-2xl"></div>

        <div class="relative z-10">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span
              class="rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/12 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-[#00FFA3] uppercase"
            >
              Platform Notice
            </span>
            <span class="rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-gray-300">
              编号 {{ String(notice.id).padStart(2, '0') }}
            </span>
          </div>

          <h2 class="mb-3 text-[28px] leading-tight font-black tracking-tight text-white">
            {{ notice.title }}
          </h2>

          <p v-if="notice.summary" class="mb-5 text-sm leading-7 text-gray-300">
            {{ notice.summary }}
          </p>

          <div class="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span class="rounded-full border border-white/8 bg-white/6 px-3 py-1.5">
              发布时间 {{ notice.createTime }}
            </span>
            <span class="rounded-full border border-white/8 bg-white/6 px-3 py-1.5">
              阅读 {{ notice.views || 0 }}
            </span>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-[#334155] bg-white/4 p-5 backdrop-blur-md">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-white">公告正文</div>
            <div class="mt-1 text-xs text-gray-500">请以平台最新公告内容为准</div>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
            <Bell class="h-4.5 w-4.5 text-[#00FFA3]" />
          </div>
        </div>

        <div class="h-px bg-linear-to-r from-transparent via-[#334155] to-transparent"></div>

        <div class="prose prose-invert mt-5 max-w-none">
          <p class="whitespace-pre-line text-[15px] leading-8 text-gray-300">
            {{ notice.content }}
          </p>
        </div>
      </div>

      <div class="rounded-3xl border border-dashed border-[#334155] bg-white/3 px-5 py-4">
        <div class="text-center text-sm text-gray-500">
          如公告内容与业务页面展示不一致，请以最新公告和客服通知为准。
        </div>
      </div>
    </div>

    <EmptyState v-else :icon="Bell" text="公告不存在" py="py-20" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNoticeStore } from '@/stores'
import { Bell } from 'lucide-vue-next'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const noticeStore = useNoticeStore()

const notice = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const loadNotice = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const id = Number(route.params.id)
    notice.value = await noticeStore.loadDetail(id)
    if (notice.value) {
      noticeStore.markAsRead(id)
    }
  } catch (error) {
    errorMessage.value = error.message || '公告加载失败'
    notice.value = null
  } finally {
    loading.value = false
  }
}

loadNotice()
</script>
