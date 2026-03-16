<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserPlus, Eye, EyeOff } from 'lucide-vue-next'
import { delay } from '@/utils'

const router = useRouter()
const userStore = useUserStore()
const toast = inject('toast')

const form = ref({
  username: '',
  password: '',
  phone: '',
  inviteCode: '',
})
const showPassword = ref(false)
const loading = ref(false)

function validate() {
  if (!/^1\d{10}$/.test(form.value.phone)) {
    toast.error('请输入正确的11位手机号')
    return false
  }
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/.test(form.value.username.trim())) {
    toast.error('用户名由中文英文数字组成，2-10位，不包含特殊字符')
    return false
  }
  if (form.value.password.length < 6) {
    toast.error('密码至少6个字符')
    return false
  }

  return true
}

async function handleRegister() {
  if (!validate()) return

  loading.value = true
  await delay()

  const result = await userStore.register({
    username: form.value.username.trim(),
    password: form.value.password,
    phone: form.value.phone,
    inviteCode: form.value.inviteCode ?? undefined,
  })
  loading.value = false

  if (result.success) {
    toast.success('注册成功')
    router.replace('/')
  } else {
    toast.error(result.message)
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center px-6">
    <div class="w-full max-w-sm">
      <img src="/logo.png" alt="Logo" class="mx-auto mb-6 h-32 w-auto" />
      <p class="mb-10 text-center text-sm text-text-secondary">加入尊享商城</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="reg-phone" class="mb-1.5 block text-sm text-text-secondary">手机号</label>
          <input
            id="reg-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
            placeholder="11位手机号"
          />
        </div>
        <div>
          <label for="reg-username" class="mb-1.5 block text-sm text-text-secondary">用户名</label>
          <input
            id="reg-username"
            v-model="form.username"
            type="text"
            autocomplete="username"
            class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
            placeholder="用户名由中文英文数字组成，2-10位，不包含特殊字符"
          />
        </div>
        <div>
          <label for="reg-password" class="mb-1.5 block text-sm text-text-secondary">密码</label>
          <div class="relative">
            <input
              id="reg-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 pr-11 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
              placeholder="至少6个字符"
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

        <div>
          <label for="reg-invite" class="mb-1.5 block text-sm text-text-secondary"
            >邀请码 <span class="text-text-muted">（选填）</span></label
          >
          <input
            id="reg-invite"
            v-model="form.inviteCode"
            type="text"
            class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
            placeholder="输入邀请人的邀请码"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-medium text-bg-primary transition-colors duration-200 hover:bg-gold-light disabled:opacity-50 cursor-pointer"
        >
          <UserPlus v-if="!loading" class="h-4 w-4" />
          <span>{{ loading ? '注册中...' : '注 册' }}</span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-text-secondary">
        已有账户？
        <router-link
          to="/login"
          class="text-gold transition-colors duration-200 hover:text-gold-light cursor-pointer"
        >
          去登录
        </router-link>
      </p>
    </div>
  </div>
</template>
