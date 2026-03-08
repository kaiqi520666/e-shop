import { noticeApi } from '@/api/modules/notice/notice.api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoticeStore = defineStore('notice', () => {
  const noticeList = ref([])
  const loading = ref(false)

  async function fetchNotices() {
    loading.value = true
    try {
      const res = await noticeApi.getNoticeList()
      noticeList.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function getNoticeById(id) {
    const res = await noticeApi.getNoticeById(id)
    return res.data
  }

  return { noticeList, loading, fetchNotices, getNoticeById }
})
