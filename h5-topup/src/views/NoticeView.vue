<template>
  <div class="p-4">
    <div
      class="relative mb-5 overflow-hidden rounded-3xl border border-[#334155] bg-linear-to-br from-[#131c2f] via-[#101521] to-[#0b0f18] p-5"
    >
      <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00FFA3]/10 blur-3xl"></div>
      <div class="absolute -bottom-8 left-0 h-24 w-24 rounded-full bg-[#3B82F6]/10 blur-2xl"></div>

      <div class="relative z-10">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div>
            <div class="mb-1 text-xs font-medium tracking-[0.24em] text-[#00FFA3]/80 uppercase">
              Notice Center
            </div>
            <h2 class="text-2xl font-black tracking-tight text-white">平台公告</h2>
          </div>
          <div
            class="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right backdrop-blur-md"
          >
            <div class="text-[10px] text-gray-500">当前公告</div>
            <div class="text-lg font-bold text-white">{{ noticeStore.notices.length }}</div>
          </div>
        </div>

        <p class="max-w-65 text-sm leading-6 text-gray-400">
          查看平台最新通知、活动更新和规则调整，重要公告会优先展示在顶部。
        </p>
      </div>
    </div>

    <div v-if="loading" class="py-12 text-center text-sm text-gray-400">公告加载中...</div>

    <div v-else-if="errorMessage" class="py-12 text-center">
      <EmptyState text="公告加载失败" />
      <button class="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm text-white" @click="loadNotices">
        重新加载
      </button>
    </div>

    <div v-else-if="noticeStore.notices.length > 0" class="space-y-4">
      <button
        v-if="featuredNotice"
        type="button"
        class="group relative block w-full overflow-hidden rounded-3xl border border-[#00FFA3]/20 bg-linear-to-br from-[#00FFA3]/10 via-[#11211c] to-[#0c1217] p-5 text-left"
        @click="handleNoticeClick(featuredNotice)"
      >
        <div class="absolute inset-0 opacity-30">
          <div
            class="absolute inset-0"
            style="
              background-image:
                linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
              background-size: 18px 18px;
            "
          ></div>
        </div>
        <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#00FFA3]/20 blur-2xl"></div>

        <div class="relative z-10">
          <div class="mb-3 flex items-center gap-2">
            <span
              class="rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/12 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-[#00FFA3] uppercase"
            >
              最新公告
            </span>
            <span
              v-if="!featuredNotice.isRead"
              class="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white"
            >
              未读
            </span>
          </div>
          <h3 class="mb-2 text-xl font-bold text-white">{{ featuredNotice.title }}</h3>
          <p class="line-clamp-2 text-sm leading-6 text-gray-300">
            {{ featuredNotice.summary || featuredNotice.content }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xs text-gray-400">{{ featuredNotice.createTime }}</span>
            <span
              class="text-sm font-medium text-[#00FFA3] transition-transform duration-200 group-hover:translate-x-1"
            >
              查看详情 →
            </span>
          </div>
        </div>
      </button>

      <div class="rounded-3xl border border-[#334155] bg-white/4 p-4 backdrop-blur-md">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-white">公告列表</div>
            <div class="text-xs text-gray-500">按发布时间倒序展示</div>
          </div>
          <div class="rounded-full bg-white/6 px-3 py-1 text-xs text-gray-400">
            未读 {{ unreadCount }}
          </div>
        </div>

        <div class="space-y-4">
          <button
            v-for="notice in listNotices"
            :key="notice.id"
            type="button"
            class="group flex w-full gap-3 rounded-2xl border border-transparent bg-white/[0.03] p-3 text-left transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06]"
            @click="handleNoticeClick(notice)"
          >
            <div class="flex w-14 shrink-0 flex-col items-center">
              <div
                class="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-linear-to-br from-white/10 to-white/[0.03]"
              >
                <span
                  class="text-sm font-bold"
                  :class="notice.isRead ? 'text-gray-500' : 'text-[#00FFA3]'"
                >
                  {{ String(notice.id).padStart(2, '0') }}
                </span>
              </div>
              <div class="h-full w-px bg-linear-to-b from-[#00FFA3]/30 to-transparent"></div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="mb-2 flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="mb-1 flex items-center gap-2">
                    <span
                      class="rounded-full px-2 py-0.5 text-[11px]"
                      :class="
                        notice.isRead
                          ? 'bg-white/8 text-gray-400'
                          : 'bg-[#00FFA3]/12 text-[#00FFA3]'
                      "
                    >
                      {{ notice.isRead ? '已读' : '新公告' }}
                    </span>
                    <span class="text-[11px] text-gray-500">{{
                      formatNoticeDate(notice.createTime)
                    }}</span>
                  </div>
                  <h3 class="truncate text-[15px] font-semibold text-white">
                    {{ notice.title }}
                  </h3>
                </div>
                <span
                  v-if="!notice.isRead"
                  class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.6)]"
                ></span>
              </div>

              <p class="line-clamp-2 text-sm leading-6 text-gray-400">
                {{ notice.summary || notice.content }}
              </p>

              <div class="mt-3 flex items-center justify-between">
                <span
                  class="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] text-gray-400"
                >
                  平台通知
                </span>
                <span
                  class="text-xs text-gray-500 transition-colors duration-200 group-hover:text-white"
                >
                  阅读全文
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="rounded-3xl border border-dashed border-[#334155] bg-white/[0.03] p-6">
      <EmptyState text="暂无公告" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticeStore } from '@/stores'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const noticeStore = useNoticeStore()

const loading = ref(false)
const errorMessage = ref('')

const featuredNotice = computed(() => noticeStore.notices[0] || null)
const listNotices = computed(() => noticeStore.notices.slice(1))
const unreadCount = computed(() => noticeStore.notices.filter((item) => !item.isRead).length)

const loadNotices = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await noticeStore.load()
  } catch (error) {
    errorMessage.value = error.message || '公告加载失败'
  } finally {
    loading.value = false
  }
}

const formatNoticeDate = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value.replace(/-/g, '/'))
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const handleNoticeClick = (notice) => {
  noticeStore.markAsRead(notice.id)
  router.push(`/notice/${notice.id}`)
}

onMounted(() => {
  loadNotices()
})
</script>
