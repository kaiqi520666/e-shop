import { ref } from 'vue'
import { defineStore } from 'pinia'
import { noticeApi } from '@/api'

const normalizeNotice = (item, readIds = new Set()) => ({
  ...item,
  isRead: readIds.has(item.id),
})

export const useNoticeStore = defineStore('notice', () => {
  const notices = ref([])
  const swiperNotices = ref([])
  const loaded = ref(false)
  const readIds = ref([])

  async function load(force = false) {
    if (loaded.value && !force) {
      return notices.value
    }

    const res = await noticeApi.getNoticeList(
      {},
      { silent: true, suppressErrorToast: true },
    )
    const readIdSet = new Set(readIds.value)
    const list = (res.data || []).map((item) => normalizeNotice(item, readIdSet))

    notices.value = list
    swiperNotices.value = list.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title,
      link: `/notice/${item.id}`,
    }))
    loaded.value = true

    return notices.value
  }

  async function loadDetail(id) {
    const existing = getNoticeById(id)
    if (existing?.content) {
      return existing
    }

    const res = await noticeApi.getNoticeDetail(
      { id },
      { silent: true, suppressErrorToast: true },
    )
    const readIdSet = new Set(readIds.value)
    const detail = normalizeNotice(res.data, readIdSet)
    const index = notices.value.findIndex((item) => item.id === detail.id)

    if (index >= 0) {
      notices.value[index] = {
        ...notices.value[index],
        ...detail,
      }
    } else {
      notices.value.unshift(detail)
    }

    return getNoticeById(id)
  }

  function reset() {
    notices.value = []
    swiperNotices.value = []
    loaded.value = false
  }

  function markAsRead(id) {
    const notice = notices.value.find((item) => item.id === id)
    if (notice) {
      notice.isRead = true
    }
    if (!readIds.value.includes(id)) {
      readIds.value = [...readIds.value, id]
    }
  }

  function getNoticeById(id) {
    return notices.value.find((item) => item.id === id) || null
  }

  return {
    notices,
    swiperNotices,
    loaded,
    readIds,
    load,
    loadDetail,
    reset,
    markAsRead,
    getNoticeById,
  }
},
{
  persist: {
    pick: ['readIds'],
  },
})
