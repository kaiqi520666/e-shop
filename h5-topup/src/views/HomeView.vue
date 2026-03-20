<template>
  <div class="relative overflow-hidden aspect-video">
    <MatrixBackground />
    <div class="flex w-full transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <button
        v-for="(img, index) in swiperImages"
        :key="img.id ?? index"
        type="button"
        class="relative w-full shrink-0 text-left"
        :class="img.link ? 'cursor-pointer' : 'cursor-default'"
        @click="handleBannerClick(img)"
      >
        <img :src="img.image" class="h-full w-full object-cover" :alt="img.title || '首页轮播图'" />
        <div v-if="img.title" class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
          <span class="font-medium text-white">{{ img.title }}</span>
        </div>
      </button>
    </div>

    <div class="absolute bottom-3 right-3 flex gap-1">
      <button
        v-for="(img, index) in swiperImages"
        :key="img.id ?? index"
        class="h-2 w-2 rounded-full transition-colors"
        :class="currentSlide === index ? 'bg-[#00FFA3]' : 'bg-white/50'"
        @click="currentSlide = index"
      />
    </div>
  </div>

  <div class="p-4">
    <div class="mb-4">
      <SectionTitle title="选择业务" :icon="Grid3x3" />
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="service in services"
          :key="service.type"
          class="group relative cursor-pointer overflow-hidden rounded-xl border border-[#334155] bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#00FFA3]/50 hover:bg-white/10"
          @click="handleServiceClick(service)"
        >
          <div
            class="absolute -right-10 -top-10 h-20 w-20 rounded-full opacity-20 transition-opacity group-hover:opacity-40"
            :class="service.colorClass"
          ></div>
          <div
            class="absolute -bottom-10 -left-10 h-16 w-16 rounded-full opacity-10 transition-opacity group-hover:opacity-30"
            :class="service.colorClass"
          ></div>
          <div
            class="absolute right-0 top-0 h-12 w-12 rounded-tr-xl border-r-2 border-t-2 opacity-30 transition-opacity group-hover:opacity-60"
            :class="service.borderClass"
          ></div>
          <div
            class="absolute bottom-0 left-0 h-12 w-12 rounded-bl-xl border-b-2 border-l-2 opacity-30 transition-opacity group-hover:opacity-60"
            :class="service.borderClass"
          ></div>
          <div class="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" :class="service.gradientClass"></div>

          <div class="relative z-10 flex flex-col items-center">
            <component :is="service.icon" class="mb-3 h-10 w-10" :class="service.iconColor" />
            <span class="font-medium text-white">{{ service.name }}</span>
            <span class="mt-1 text-xs text-gray-400">{{ service.desc }}</span>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <SectionTitle title="快捷充值" :icon="Zap" />
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="(amount, index) in quickAmounts"
            :key="amount"
            class="relative overflow-hidden rounded-xl border border-[#334155] bg-white/5 transition-all duration-150 hover:border-[#00FFA3]/50 active:scale-95 active:bg-[#00FFA3]/10"
            @click="router.push('/recharge?amount=' + amount)"
          >
            <div
              v-if="index === recommendIndex"
              class="absolute right-0 top-0 rounded-bl-lg rounded-tr-xl bg-[#F59E0B] px-1.5 py-0.5 text-[9px] font-bold leading-tight text-[#1a1000]"
            >
              热门
            </div>

            <div class="relative z-10 flex flex-col items-center gap-0.5 py-3">
              <span class="text-[10px] leading-none text-gray-500">¥</span>
              <span class="text-base leading-none font-bold text-white">{{ amount }}</span>
              <span class="mt-0.5 text-[9px] leading-none text-gray-500">≈ {{ getQuickUsdt(amount) }} U</span>
            </div>
          </button>
        </div>
      </div>

      <div class="mt-6">
        <SectionTitle title="新手引导" :icon="Award" />
        <div class="space-y-3">
          <div
            v-for="(item, index) in guides"
            :key="index"
            class="flex cursor-pointer items-center gap-3 rounded-xl border border-[#334155] bg-white/5 p-3 backdrop-blur-md transition-all hover:border-[#00FFA3]/50"
            @click="$router.push(item.link)"
          >
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00FFA3]/20 text-xs font-bold text-[#00FFA3]">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <div class="text-sm text-white">{{ item.title }}</div>
              <div class="text-xs text-gray-500">{{ item.desc }}</div>
            </div>
            <ChevronRight class="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      <div class="mt-6">
        <SectionTitle title="品牌信任" :icon="Shield" />
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="item in trustItems"
            :key="item.label"
            class="group relative overflow-hidden rounded-xl border border-[#334155] bg-white/5 p-3 backdrop-blur-md transition-all duration-300 hover:border-white/20"
          >
            <div class="absolute inset-0 opacity-5">
              <div
                class="absolute inset-0"
                style="
                  background-image:
                    linear-gradient(#fff 1px, transparent 1px),
                    linear-gradient(90deg, #fff 1px, transparent 1px);
                  background-size: 20px 20px;
                "
              ></div>
            </div>
            <div
              class="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
              :style="{ backgroundColor: item.color }"
            ></div>
            <div
              class="absolute -bottom-4 -left-4 h-16 w-16 rounded-full opacity-30 blur-xl transition-opacity group-hover:opacity-50"
              :style="{ backgroundColor: item.color }"
            ></div>
            <div
              class="absolute right-0 top-0 h-16 w-16 opacity-10 transition-opacity group-hover:opacity-20"
              :style="{ borderTop: `2px solid ${item.color}`, borderRight: `2px solid ${item.color}`, borderTopRightRadius: '12px' }"
            ></div>

            <div class="relative z-10 flex flex-col items-center gap-2">
              <div class="shrink-0 rounded-lg p-4" :style="{ backgroundColor: `${item.color}15` }">
                <component :is="item.icon" class="h-5 w-5" :style="{ color: item.color }" />
              </div>

              <span class="text-sm font-semibold text-white">{{ item.value }}</span>
              <span class="text-[10px] text-gray-500">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Zap,
  CreditCard,
  Wallet,
  Landmark,
  Grid3x3,
  Shield,
  Users,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-vue-next'
import SectionTitle from '@/components/SectionTitle.vue'
import { useAppStore, useBannerStore, useCategoryStore } from '@/stores'
import MatrixBackground from '@/components/MatrixBackground.vue'

const currentSlide = ref(0)
const router = useRouter()
const categoryStore = useCategoryStore()
const appStore = useAppStore()
const bannerStore = useBannerStore()
const exchangeRate = ref(0)

const recommendIndex = 1

const fallbackSwiperImages = [
  { id: 'fallback-1', image: '1.png', title: '', link: '' },
  { id: 'fallback-2', image: '2.png', title: '', link: '' },
  { id: 'fallback-3', image: '3.png', title: '', link: '' },
]

const swiperImages = computed(() => {
  const banners = bannerStore.banners || []
  return banners.length > 0 ? banners : fallbackSwiperImages
})

onMounted(async () => {
  await Promise.all([
    categoryStore.load(),
    appStore.load(),
    bannerStore.load(),
  ])
  exchangeRate.value = Number(appStore.getConfigValue('usdt_rate') || 7.2)
  resetAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

const services = [
  {
    type: 'phone',
    name: '话费充值',
    desc: '快速到账',
    icon: Zap,
    colorClass: 'bg-[#00FFA3]',
    borderClass: 'border-[#00FFA3]',
    iconColor: 'text-[#00FFA3]',
    gradientClass: 'bg-linear-to-br from-[#00FFA3]/10 to-transparent',
  },
  {
    type: 'electric',
    name: '电费充值',
    desc: '安全可靠',
    icon: Landmark,
    colorClass: 'bg-[#F59E0B]',
    borderClass: 'border-[#F59E0B]',
    iconColor: 'text-[#F59E0B]',
    gradientClass: 'bg-linear-to-br from-[#F59E0B]/10 to-transparent',
  },
  {
    type: 'credit',
    name: '信用卡代还',
    desc: '低费率',
    icon: CreditCard,
    colorClass: 'bg-[#8B5CF6]',
    borderClass: 'border-[#8B5CF6]',
    iconColor: 'text-[#8B5CF6]',
    gradientClass: 'bg-linear-to-br from-[#8B5CF6]/10 to-transparent',
  },
  {
    type: 'dxm',
    name: '度小满代还',
    desc: '额度高',
    icon: Wallet,
    colorClass: 'bg-[#3B82F6]',
    borderClass: 'border-[#3B82F6]',
    iconColor: 'text-[#3B82F6]',
    gradientClass: 'bg-linear-to-br from-[#3B82F6]/10 to-transparent',
  },
]

const trustItems = [
  { label: '安全合规', value: '100%', icon: Shield, color: '#3B82F6' },
  { label: '服务用户', value: '50万+', icon: Users, color: '#00FFA3' },
  { label: '运行稳定', value: '99.9%', icon: Clock, color: '#8B5CF6' },
  { label: '行业经验', value: '30+', icon: Award, color: '#F59E0B' },
]

const quickAmounts = [100, 200, 300, 500]

const guides = [
  { title: 'USDT 充值', desc: '使用 TRC-20 网络充值，安全稳定', link: '/recharge' },
  { title: '绑定钱包', desc: '首次提现前请先绑定钱包地址', link: '/wallet' },
  { title: '开始下单', desc: '选择金额并确认支付即可完成下单', link: '/recharge/phone' },
]

let autoPlayTimer = null

watch(
  () => swiperImages.value.length,
  (length) => {
    if (currentSlide.value >= length) {
      currentSlide.value = 0
    }
    resetAutoPlay()
  },
)

const getQuickUsdt = (amount) => {
  const rate = exchangeRate.value || 7.2
  return (amount / rate).toFixed(1)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()

  if (swiperImages.value.length <= 1) {
    return
  }

  autoPlayTimer = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % swiperImages.value.length
  }, 4000)
}

const handleBannerClick = (banner) => {
  const link = banner?.link?.trim()

  if (!link) {
    return
  }

  if (link.startsWith('/')) {
    router.push(link)
    return
  }

  if (/^https?:\/\//i.test(link)) {
    window.location.href = link
  }
}

const handleServiceClick = (service) => {
  router.push(`/recharge/${service.type}`)
}
</script>

<style scoped></style>
