<template>
  <div class="flex flex-col">
    <AuthBackground />

    <div class="relative z-10 flex-1 p-6">
      <div class="mb-10 mt-12 text-center">
        <img src="/logo.png" alt="logo" class="mx-auto h-40 w-40" />
      </div>

      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm text-gray-400">手机号</label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              v-model="form.phone"
              type="tel"
              maxlength="11"
              placeholder="请输入手机号"
              class="input-field-icon"
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm text-gray-400">密码</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              class="input-field-icon"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Eye v-if="showPassword" class="h-5 w-5 text-gray-500" />
              <EyeOff v-else class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <button @click="handleLogin" class="btn-primary-lg mt-6 w-full">登录</button>
      </div>

      <div class="mt-6 text-center text-sm text-gray-500">
        还没有账号？
        <router-link :to="registerRoute" class="ml-1 text-[#00FFA3] hover:underline">
          立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { User, Lock, Eye, EyeOff } from 'lucide-vue-next'
import AuthBackground from '@/components/AuthBackground.vue'
import { useUi } from '@/composables/useUi'
import { resolveLoginRedirect } from '@/services/session'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { toast } = useUi()

const form = ref({
  phone: '',
  password: '',
})
const showPassword = ref(false)

const registerRoute = computed(() => ({
  path: '/register',
  query: route.query.redirect ? { redirect: route.query.redirect } : undefined,
}))

const handleLogin = async () => {
  if (!form.value.phone) {
    toast.warning('请输入手机号')
    return
  }
  if (!form.value.password) {
    toast.warning('请输入密码')
    return
  }

  const ok = await userStore.login(form.value.phone, form.value.password)
  if (ok) {
    toast.success('登录成功')
    router.push(resolveLoginRedirect(route.query.redirect))
  }
}
</script>
