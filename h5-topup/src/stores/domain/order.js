import { defineStore } from 'pinia'
import { orderApi } from '@/api'
import { createCachedResourceStore } from '@/stores/helpers/createCachedResourceStore'

const useOrderSummaryStore = createCachedResourceStore('order-summary', {
  persistKey: 'order',
  dataKey: 'cumulative',
  fetcher: async () => {
    const res = await orderApi.cumulative()
    return res.data
  },
})

export const useOrderStore = defineStore('order', () => {
  const summaryStore = useOrderSummaryStore()

  async function createOrder(order) {
    const res = await orderApi.createOrder(order)
    return res.data
  }

  async function getDetail(data) {
    return await orderApi.getDetail(data)
  }

  async function getList(data) {
    return await orderApi.getList(data)
  }

  async function cancelOrder(data) {
    await orderApi.cancelOrder(data)
    return true
  }

  return {
    cumulative: summaryStore.cumulative,
    cachedAt: summaryStore.cachedAt,
    load: summaryStore.load,
    refresh: summaryStore.refresh,
    clear: summaryStore.clear,
    createOrder,
    getDetail,
    getList,
    cancelOrder,
  }
})
