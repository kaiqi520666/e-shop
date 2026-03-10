import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCartStore } from './cart'
import { userApi } from '@/api/modules/user/user.api'
import { withdrawApi } from '@/api/modules/user/withdraw.api'
import { rechargeApi } from '@/api/modules/user/recharge.api'

export const useUserStore = defineStore(
  'user',
  () => {
    const currentUser = ref(null)
    const isLoggedIn = computed(() => !!currentUser.value)

    async function login(username, password) {
      try {
        const res = await userApi.login({ username, password })
        const tokenData = res.data
        // 保存 token 信息
        currentUser.value = {
          token: tokenData.token,
          refreshToken: tokenData.refreshToken,
          expire: tokenData.expire,
          refreshExpire: tokenData.refreshExpire,
        }
        // 登录成功后获取用户信息
        await fetchUserInfo()
        // 同步购物车
        const cartStore = useCartStore()
        await cartStore.fetchCart()
        await fetchDirectTeamCount()
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    async function register({ username, password, phone, inviteCode }) {
      try {
        const res = await userApi.register({ username, password, phone, inviteCode })
        const tokenData = res.data
        // 保存 token 信息
        currentUser.value = {
          token: tokenData.token,
          refreshToken: tokenData.refreshToken,
          expire: tokenData.expire,
          refreshExpire: tokenData.refreshExpire,
        }
        // 注册成功后获取用户信息
        await fetchUserInfo()
        // 同步购物车
        const cartStore = useCartStore()
        await cartStore.fetchCart()
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    async function fetchUserInfo() {
      try {
        const res = await userApi.getUserInfo()
        const userInfo = res.data
        // 合并用户信息与 token 信息
        currentUser.value = {
          ...currentUser.value,
          ...userInfo,
        }
        return userInfo
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    }

    async function updateUserInfo(data) {
      try {
        const res = await userApi.updateUserInfo(data)
        currentUser.value = res.data
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    async function recharge(amount) {
      if (!currentUser.value) return { success: false, message: '请先登录' }
      try {
        const res = await rechargeApi.apply({ amount: Number(amount) })
        return res.data
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    async function getRechargeList() {
      if (!currentUser.value) return { success: false, message: '请先登录' }
      try {
        const res = await rechargeApi.getList({})
        return res.data
      } catch (error) {
        return { success: false, message: error.message }
      }
    }
    async function withdraw(amount, password) {
      if (!currentUser.value) return { success: false, message: '请先登录' }
      try {
        await withdrawApi.apply({ amount: Number(amount), password })
        await fetchUserInfo()
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    function deductBalance(amount) {
      if (!currentUser.value) return false
      const num = Number(amount)
      if (isNaN(num) || num <= 0) return false
      const bal = currentUser.value.balance ?? 0
      if (num > bal) return false
      currentUser.value.balance = bal - num
      return true
    }

    async function fetchTransactions() {
      if (!currentUser.value) return []
      try {
        const res = await userApi.getTransactionRecord({})
        return res.data || []
      } catch {
        return []
      }
    }

    async function fetchTeam() {
      if (!currentUser.value) return []
      try {
        const res = await userApi.getTeamMember({})
        return res.data || []
      } catch {
        return []
      }
    }

    async function fetchDirectTeamCount() {
      if (!currentUser.value) return 0
      try {
        const res = await userApi.getDirectTeamCount()
        const count = res.data || 0
        // 保存到 currentUser 中
        if (currentUser.value) {
          currentUser.value.directTeamCount = count
        }
        return count
      } catch {
        return 0
      }
    }
    async function fetchTeamCount() {
      if (!currentUser.value) return 0
      try {
        const res = await userApi.getTeamCount()
        const count = res.data || 0
        // 保存到 currentUser 中
        if (currentUser.value) {
          currentUser.value.teamCount = count
        }

        return count
      } catch {
        return 0
      }
    }

    async function fetchCommissions() {
      if (!currentUser.value) return []
      try {
        const res = await userApi.getCommissionRecord({})
        return res.data || []
      } catch {
        return []
      }
    }

    async function setSubRate(subUserId, rate) {
      if (!currentUser.value) return { success: false, message: '请先登录' }
      try {
        await userApi.setSubRate({
          subUserId,
          rate,
        })
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    async function fetchWallet() {
      if (!currentUser.value) return ''
      try {
        const res = await userApi.getUserInfo()
        currentUser.value.walletAddress = res.data.walletAddress
        return res.data.walletAddress || ''
      } catch {
        return ''
      }
    }

    async function bindWallet(address, password) {
      if (!currentUser.value) return { success: false, message: '请先登录' }
      try {
        await userApi.bindWallet({ address, password })
        // 刷新用户信息
        await fetchUserInfo()
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    function logout() {
      currentUser.value = null
    }

    return {
      currentUser,
      isLoggedIn,
      login,
      register,
      fetchUserInfo,
      updateUserInfo,
      recharge,
      withdraw,
      deductBalance,
      fetchTransactions,
      fetchTeam,
      fetchDirectTeamCount,
      fetchTeamCount,
      fetchCommissions,
      setSubRate,
      fetchWallet,
      bindWallet,
      logout,
      getRechargeList,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['currentUser'],
    },
  },
)
