<template>
  <div class="flex flex-col">
    <AuthBackground />

    <div class="relative z-10 flex-1 p-6">
      <button @click="router.back()" class="mb-4 self-start">
        <ArrowLeft class="h-6 w-6 text-white" />
      </button>

      <div class="mb-8 text-center">
        <h1 class="mb-2 text-2xl font-bold text-white">注册账号</h1>
        <p class="text-gray-500">创建账号后即可开始使用</p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm text-gray-400">用户名</label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input v-model="form.username" type="text" placeholder="请输入用户名" class="input-field-icon" />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm text-gray-400">手机号</label>
          <div class="relative">
            <Phone class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input v-model="form.phone" type="tel" maxlength="11" placeholder="请输入手机号" class="input-field-icon" />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm text-gray-400">密码</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" class="input-field-icon" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2">
              <Eye v-if="showPassword" class="h-5 w-5 text-gray-500" />
              <EyeOff v-else class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm text-gray-400">确认密码</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="请再次输入密码" class="input-field-icon" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2">
              <Eye v-if="showConfirmPassword" class="h-5 w-5 text-gray-500" />
              <EyeOff v-else class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm text-gray-400">邀请码 <span class="text-gray-600">(选填)</span></label>
          <div class="relative">
            <QrCode class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input v-model="form.inviteCode" type="text" placeholder="请输入邀请码" class="input-field-icon" />
          </div>
        </div>

        <button @click="handleRegister" :disabled="isSubmitting" class="btn-primary-lg mt-6 w-full disabled:opacity-70">
          {{ isSubmitting ? '注册中...' : '注册' }}
        </button>
      </div>

      <div class="mt-6 text-center text-sm text-gray-500">
        已有账号？
        <router-link to="/login" class="ml-1 text-[#00FFA3] hover:underline">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { ArrowLeft, User, Phone, Lock, Eye, EyeOff, QrCode } from 'lucide-vue-next'
import AuthBackground from '@/components/AuthBackground.vue'
import { useUi } from '@/composables/useUi'

const router = useRouter()
const userStore = useUserStore()
const { toast } = useUi()

const form = ref({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  inviteCode: '',
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)

const handleRegister = async () => {
  if (isSubmitting.value) {
    return
  }
  if (!form.value.username) {
    toast.warning('请输入用户名')
    return
  }
  if (!form.value.phone || form.value.phone.length !== 11) {
    toast.warning('请输入正确的手机号')
    return
  }
  if (!form.value.password) {
    toast.warning('请输入密码')
    return
  }
  if (form.value.password.length < 6) {
    toast.warning('密码至少 6 位')
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('两次输入的密码不一致')
    return
  }

  isSubmitting.value = true

  try {
    await userStore.register(
      form.value.username.trim(),
      form.value.phone.trim(),
      form.value.password,
      form.value.inviteCode.trim(),
    )
    toast.success('注册成功')
    router.push('/')
  } finally {
    isSubmitting.value = false
  }
}
</script>
