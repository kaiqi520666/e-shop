import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { useAppStore } from './app'
import { cartApi } from '@/api/modules/shop/cart.api'

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref([])
    const loading = ref(false)

    const appStore = useAppStore()

    const totalUSDT = computed(() =>
      items.value.reduce((sum, item) => sum + (Number(item.priceRMB) / appStore.usdt_rate) * item.quantity, 0),
    )

    const totalRMB = computed(() =>
      items.value.reduce((sum, item) => sum + Number(item.priceRMB) * item.quantity, 0),
    )

    const itemCount = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0),
    )

    async function fetchCart() {
      const userStore = useUserStore()
      if (!userStore.currentUser) return

      loading.value = true
      try {
        const res = await cartApi.list()
        items.value = res.data
      } catch (error) {
        console.error('获取购物车失败:', error)
      } finally {
        loading.value = false
      }
    }

    async function addItem(product, quantity = 1) {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        return { success: false, message: '请先登录' }
      }

      loading.value = true
      try {
        await cartApi.add({
          productId: Number(product.id),
          quantity,
        })
        await fetchCart()
        return { success: true }
      } catch (error) {
        console.error('添加购物车失败:', error)
        return { success: false, message: error.message }
      } finally {
        loading.value = false
      }
    }

    async function removeItem(id) {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        return { success: false, message: '请先登录' }
      }

      loading.value = true
      try {
        await cartApi.remove({ ids: [id] })
        items.value = items.value.filter((i) => i.id !== id)
        return { success: true }
      } catch (error) {
        console.error('删除购物车商品失败:', error)
        return { success: false, message: error.message }
      } finally {
        loading.value = false
      }
    }

    async function updateQuantity(id, quantity) {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        return { success: false, message: '请先登录' }
      }

      loading.value = true
      try {
        await cartApi.updateQuantity({ id, quantity })
        const item = items.value.find((i) => i.id === id)
        if (item) {
          item.quantity = quantity
        }
        return { success: true }
      } catch (error) {
        console.error('更新购物车数量失败:', error)
        return { success: false, message: error.message }
      } finally {
        loading.value = false
      }
    }

    async function clearCart() {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        return { success: false, message: '请先登录' }
      }

      loading.value = true
      try {
        await cartApi.clear()
        items.value = []
        return { success: true }
      } catch (error) {
        console.error('清空购物车失败:', error)
        return { success: false, message: error.message }
      } finally {
        loading.value = false
      }
    }

    return {
      items,
      loading,
      totalUSDT,
      totalRMB,
      itemCount,
      fetchCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }
  },
  {
    persist: false,
  }
)
