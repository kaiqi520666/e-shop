<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAddressStore } from '@/stores/address'
import { userApi } from '@/api/modules/user/user.api'
import Header from '@/components/layout/Header.vue'
import Loading from '@/components/common/Loading.vue'

const route = useRoute()
const router = useRouter()
const addressStore = useAddressStore()
const toast = inject('toast')

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  phone: '',
  detail: '',
  isDefault: false,
})

const loading = ref(false)
const submitting = ref(false)

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const res = await userApi.getAddressInfo(route.params.id)
      if (res.code === 1000 && res.data) {
        const addr = res.data
        form.value = {
          name: addr.contact,
          phone: addr.phone,
          detail: addr.address,
          isDefault: !!addr.isDefault,
        }
      }
    } catch (error) {
      toast.error('获取地址信息失败')
    } finally {
      loading.value = false
    }
  }
})

function validate() {
  if (!form.value.name.trim()) {
    toast.error('请输入收货人姓名')
    return false
  }
  if (!/^1\d{10}$/.test(form.value.phone)) {
    toast.error('请输入正确的手机号')
    return false
  }
  if (!form.value.detail.trim()) {
    toast.error('请输入详细地址')
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true

  let result
  if (isEdit.value) {
    result = await addressStore.update(route.params.id, form.value)
  } else {
    result = await addressStore.add(form.value)
  }

  submitting.value = false

  if (result.success) {
    toast.success(isEdit.value ? '地址已更新' : '地址已添加')
    router.back()
  } else {
    toast.error(result.message)
  }
}
</script>

<template>
  <div class="pb-6">
    <Header :title="isEdit ? '编辑地址' : '新增地址'" show-back />
    <Loading :visible="loading || submitting" />

    <form class="px-4 py-4 space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="addr-name" class="mb-1.5 block text-sm text-text-secondary">收货人</label>
        <input
          id="addr-name"
          v-model="form.name"
          type="text"
          class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
          placeholder="收货人姓名"
        />
      </div>

      <div>
        <label for="addr-phone" class="mb-1.5 block text-sm text-text-secondary">手机号</label>
        <input
          id="addr-phone"
          v-model="form.phone"
          type="tel"
          class="w-full rounded-lg border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
          placeholder="11位手机号"
        />
      </div>

      <div>
        <label for="addr-detail" class="mb-1.5 block text-sm text-text-secondary">详细地址</label>
        <textarea
          id="addr-detail"
          v-model="form.detail"
          rows="3"
          class="w-full resize-none rounded-lg border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-gold"
          placeholder="请填写完整收货地址"
        />
      </div>

      <label class="flex items-center gap-3 cursor-pointer">
        <input
          v-model="form.isDefault"
          type="checkbox"
          class="h-4 w-4 rounded border-border bg-bg-card accent-gold cursor-pointer"
        />
        <span class="text-sm text-text-secondary">设为默认地址</span>
      </label>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full rounded-lg bg-gold py-3 text-sm font-medium text-bg-primary transition-colors duration-200 hover:bg-gold-light disabled:opacity-50 cursor-pointer"
      >
        {{ isEdit ? '保存修改' : '添加地址' }}
      </button>
    </form>
  </div>
</template>
