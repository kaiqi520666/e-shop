import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/modules/user/user.api'

export const useAddressStore = defineStore(
  'address',
  () => {
    const addressList = ref([])
    const loading = ref(false)

    const defaultAddress = computed(() =>
      addressList.value.find((a) => a.isDefault) || addressList.value[0] || null,
    )

    async function fetchAddressList() {
      loading.value = true
      try {
        const res = await userApi.getAddressList()
        if (res.code === 1000) {
          addressList.value = res.data || []
        }
      } catch (error) {
        console.error('获取地址列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    async function add(address) {
      if (addressList.value.length >= 10) {
        return { success: false, message: '最多添加10个地址' }
      }

      const params = {
        contact: address.name,
        phone: address.phone,
        address: address.detail,
        isDefault: address.isDefault || addressList.value.length === 0,
      }

      try {
        const res = await userApi.addAddress(params)
        if (res.code === 1000) {
          await fetchAddressList()
          return { success: true }
        }
        return { success: false, message: res.message || '添加失败' }
      } catch (error) {
        return { success: false, message: error.message || '添加失败' }
      }
    }

    async function update(id, data) {
      const params = {
        id,
        contact: data.name,
        phone: data.phone,
        address: data.detail,
        isDefault: data.isDefault,
      }

      try {
        const res = await userApi.updateAddress(params)
        if (res.code === 1000) {
          await fetchAddressList()
          return { success: true }
        }
        return { success: false, message: res.message || '更新失败' }
      } catch (error) {
        return { success: false, message: error.message || '更新失败' }
      }
    }

    async function remove(id) {
      try {
        const res = await userApi.deleteAddress([id])
        if (res.code === 1000) {
          const idx = addressList.value.findIndex((a) => a.id === id)
          if (idx !== -1) {
            const wasDefault = addressList.value[idx].isDefault
            addressList.value.splice(idx, 1)
            if (wasDefault && addressList.value.length > 0) {
              await setDefault(addressList.value[0].id)
            }
          }
          return { success: true }
        }
        return { success: false, message: res.message || '删除失败' }
      } catch (error) {
        return { success: false, message: error.message || '删除失败' }
      }
    }

    async function setDefault(id) {
      const addr = addressList.value.find((a) => a.id === id)
      if (!addr) return { success: false, message: '地址不存在' }

      try {
        const res = await userApi.updateAddress({
          id,
          contact: addr.contact || addr.name,
          phone: addr.phone,
          address: addr.address || addr.detail,
          isDefault: true,
        })
        if (res.code === 1000) {
          addressList.value.forEach((a) => {
            a.isDefault = a.id === id
          })
          return { success: true }
        }
        return { success: false, message: res.message || '设置失败' }
      } catch (error) {
        return { success: false, message: error.message || '设置失败' }
      }
    }

    return {
      addressList,
      defaultAddress,
      loading,
      fetchAddressList,
      add,
      update,
      remove,
      setDefault,
    }
  },
  {
    persist: false,
  },
)
