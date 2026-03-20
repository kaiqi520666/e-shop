import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi, infoApi } from '@/api'
import { getToast } from '@/services/ui'
import { copyText } from '@/utils/clipboard'

function createEmptyUser() {
  return {
    id: '',
    username: '',
    phone: '',
    avatarUrl: '',
    inviteCode: '',
    balance: 0,
    totalIncome: 0,
    walletAddress: '',
    token: '',
    refreshToken: '',
    commissionRate: 0,
    createTime: '',
    updateTime: '',
  }
}

function normalizeUserInfoConfig(configOrSilent = false) {
  if (typeof configOrSilent === 'boolean') {
    return { silent: configOrSilent }
  }

  return configOrSilent || {}
}

export const useUserStore = defineStore(
  'user',
  () => {
    const currentUser = ref(createEmptyUser())
    const isLoggedIn = computed(() => !!currentUser.value?.token)
    let refreshPromise = null

    async function login(phone, password) {
      const res = await authApi.login({ phone, password })
      currentUser.value = {
        ...createEmptyUser(),
        token: res.data.token,
        refreshToken: res.data.refreshToken,
      }
      await getUserInfo()
      return true
    }

    async function register(username, phone, password, inviteCode = '') {
      const res = await authApi.register({ username, phone, password, inviteCode })
      currentUser.value = {
        ...createEmptyUser(),
        token: res.data.token,
        refreshToken: res.data.refreshToken,
      }
      await getUserInfo()
      return true
    }

    async function getUserInfo(configOrSilent = false) {
      const config = normalizeUserInfoConfig(configOrSilent)
      const res = await infoApi.getUserInfo(config)
      currentUser.value = { ...currentUser.value, ...res.data }
      return true
    }

    async function refreshUserInfoSilently() {
      if (refreshPromise) {
        return refreshPromise
      }

      refreshPromise = (async () => {
        try {
          await getUserInfo({ silent: true, suppressErrorToast: true })
          return true
        } catch {
          return false
        } finally {
          refreshPromise = null
        }
      })()

      return refreshPromise
    }

    async function updateUser(data) {
      await infoApi.updateUserInfo(data)
      currentUser.value = { ...currentUser.value, ...data }
      return true
    }

    function logout() {
      currentUser.value = createEmptyUser()
    }

    async function copyInviteCode() {
      const copied = await copyText(currentUser.value.inviteCode)
      if (copied) {
        getToast().success(`邀请码已复制：${currentUser.value.inviteCode}`)
      } else {
        getToast().error('复制失败，请手动长按选择复制')
      }
    }

    async function getTeamMember() {
      return await infoApi.getTeamMember()
    }

    async function setSubRate(data) {
      await infoApi.setSubRate(data)
      return true
    }

    return {
      currentUser,
      isLoggedIn,
      updateUser,
      logout,
      copyInviteCode,
      login,
      register,
      getUserInfo,
      refreshUserInfoSilently,
      getTeamMember,
      setSubRate,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['currentUser'],
    },
  },
)
