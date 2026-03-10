<script setup>
import { ref, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { LogIn, Eye, EyeOff } from 'lucide-vue-next'
import { delay } from '@/utils'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const toast = inject('toast')

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleLogin() {
  if (!username.value.trim()) return toast.error('请输入用户名')
  if (!password.value) return toast.error('请输入密码')

  loading.value = true
  const result = await userStore.login(username.value.trim(), password.value)
  loading.value = false

  if (result.success) {
    toast.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } else {
    toast.error(result.message)
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center px-6">
    <div class="w-full max-w-sm">
      <img src="/logo.png" alt="Logo" class="mx-auto mb-6 h-32 w-auto" />
      <p class="mb-10 text-center text-sm text-text-secondary">登录您的账户</p>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label for="username" class="mb-1.5 block text-sm text-text-secondary">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
            placeholder="请输入用户名"
          />
        </div>

        <div>
          <label for="password" class="mb-1.5 block text-sm text-text-secondary">密码</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 pr-11 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
              placeholder="请输入密码"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-200 hover:text-text-secondary cursor-pointer"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-5 w-5" />
              <Eye v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-medium text-bg-primary transition-colors duration-200 hover:bg-gold-light disabled:opacity-50 cursor-pointer"
        >
          <LogIn v-if="!loading" class="h-4 w-4" />
          <span>{{ loading ? '登录中...' : '登 录' }}</span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-text-secondary">
        还没有账户？
        <router-link
          to="/register"
          class="text-gold transition-colors duration-200 hover:text-gold-light cursor-pointer"
        >
          立即注册
        </router-link>
      </p>
    </div>
  </div>
</template>
