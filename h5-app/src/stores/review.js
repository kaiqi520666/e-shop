import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'
import { reviewApi } from '@/api/modules/shop/review.api'

export const useReviewStore = defineStore('review', () => {
  // 当前商品的评价列表（productId -> reviews[]）
  const reviewsMap = ref({})
  // 当前商品的评价摘要（productId -> summary）
  const summaryMap = ref({})
  const loading = ref(false)
  const submitting = ref(false)

  async function fetchReviews(productId) {
    loading.value = true
    try {
      const res = await reviewApi.getReviewList(productId)
      reviewsMap.value[productId] = res.data
    } catch (error) {
      console.error('获取评价失败:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary(productId) {
    try {
      const res = await reviewApi.getReviewSummary(productId)
      summaryMap.value[productId] = res.data
    } catch (error) {
      console.error('获取评价摘要失败:', error)
    }
  }

  async function submitReview({ productId, userId, username, rating, content, images }) {
    submitting.value = true
    try {
      const res = await api.post('/api/reviews/submit', {
        productId,
        userId,
        username,
        rating,
        content,
        images,
      })
      // 刷新该商品评价数据
      await Promise.all([fetchReviews(productId), fetchSummary(productId)])
      return { success: true, data: res.data }
    } catch (error) {
      console.error('提交评价失败:', error)
      return { success: false, error }
    } finally {
      submitting.value = false
    }
  }

  function getReviews(productId) {
    return reviewsMap.value[productId] || []
  }

  function getSummary(productId) {
    return summaryMap.value[productId] || null
  }

  function getPositiveRate(productId) {
    const summary = getSummary(productId)
    if (!summary || summary.total === 0) return 0
    const positive = (summary.fiveStarCount || 0) + (summary.fourStarCount || 0)
    return Math.round((positive / summary.total) * 100)
  }

  return {
    reviewsMap,
    summaryMap,
    loading,
    submitting,
    fetchReviews,
    fetchSummary,
    submitReview,
    getReviews,
    getSummary,
    getPositiveRate,
  }
})
