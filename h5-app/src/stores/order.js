import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderApi } from '@/api/modules/shop/order.api'

const STATUS_LABELS = {
  0: '待支付',
  1: '已支付',
  2: '已发货',
  3: '已完成',
  4: '已取消',
}

export const useOrderStore = defineStore('order', () => {
  const orderList = ref([])
  const loading = ref(false)
  const currentOrder = ref(null)

  async function fetchOrders(status) {
    loading.value = true
    try {
      const res = await orderApi.getOrderList({ status })
      if (res.code === 1000) {
        orderList.value = res.data?.list || []
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(id) {
    loading.value = true
    try {
      const res = await orderApi.getOrderById({ id })
      if (res.code === 1000) {
        currentOrder.value = res.data
        return res.data
      }
    } catch (error) {
      console.error('获取订单详情失败:', error)
    } finally {
      loading.value = false
    }
    return null
  }

  function getStatusLabel(status) {
    return STATUS_LABELS[status] || '未知'
  }

  return {
    orderList,
    currentOrder,
    loading,
    fetchOrders,
    fetchOrderById,
    getStatusLabel,
  }
})
