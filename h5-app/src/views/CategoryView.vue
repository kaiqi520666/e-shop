<script setup>
import { ref, computed, watch, inject, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils'
import { ShoppingCart, Wind, Wine, Cigarette } from 'lucide-vue-next'
import Empty from '@/components/common/Empty.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const toast = inject('toast')

// 图标映射
const iconMap = {
  Wind,
  Wine,
  Cigarette,
}

const activeCategoryId = ref('')
const activeSubId = ref('')

const tabRefs = ref([])
const tabsContainerRef = ref(null)
const indicatorStyle = ref({ left: 0, width: 0 })

// 初始化 activeCategoryId
function initCategoryId() {
  const idFromRoute = route.params.id
  // 统一转为字符串比较
  const foundCategory = productStore.categoryList.find((c) => String(c.id) === String(idFromRoute))
  const firstCategoryId = productStore.categoryList[0]?.id
  activeCategoryId.value = foundCategory
    ? String(foundCategory.id)
    : firstCategoryId
      ? String(firstCategoryId)
      : ''
}

const activeCategory = computed(() =>
  productStore.categoryList.find((c) => String(c.id) === activeCategoryId.value),
)

const subCategories = computed(() => activeCategory.value?.subCategories || [])

const filteredProducts = computed(() => {
  if (activeSubId.value) {
    return productStore.getByCategory(activeSubId.value)
  }
  // 传递主分类 ID，用于获取该主分类下所有子分类的商品
  return productStore.getByCategory(null, activeCategoryId.value)
})

function updateIndicator() {
  nextTick(() => {
    const activeIndex = productStore.categoryList.findIndex(
      (c) => String(c.id) === String(activeCategoryId.value),
    )
    const tabEl = tabRefs.value[activeIndex]
    const containerEl = tabsContainerRef.value
    if (tabEl && containerEl) {
      const tabRect = tabEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      indicatorStyle.value = {
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      }
    }
  })
}

watch(
  () => route.params.id,
  (id) => {
    if (id) {
      activeCategoryId.value = id
      activeSubId.value = ''
    } else if (!activeCategoryId.value && productStore.categoryList.length > 0) {
      // 如果没有选中任何分类且数据已加载，则初始化
      initCategoryId()
    }
  },
)

watch(activeCategoryId, () => {
  activeSubId.value = ''
  updateIndicator()
})

// 监听分类数据加载完成
watch(
  () => productStore.categoryList,
  (list) => {
    if (list.length > 0 && !activeCategoryId.value) {
      initCategoryId()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  // 加载分类和产品数据
  if (productStore.categoryList.length === 0) {
    await Promise.all([productStore.fetchCategories(), productStore.fetchProducts()])
  }

  // 数据加载完成后初始化分类 ID
  initCategoryId()
  updateIndicator()
})

function addToCart(product) {
  cartStore.addItem(product)
  toast.success('已加入购物车')
}
</script>

<template>
  <div class="pb-4">
    <!-- Category Tabs -->
    <div class="sticky top-0 z-40 border-b border-border bg-bg-primary/95 backdrop-blur-sm">
      <!-- Main category tabs with sliding indicator -->
      <div ref="tabsContainerRef" class="relative flex gap-3 px-4 pt-4 pb-3">
        <button
          v-for="(cat, index) in productStore.categoryList"
          :key="cat.id"
          :ref="
            (el) => {
              if (el) tabRefs[index] = el
            }
          "
          class="relative z-10 flex items-center gap-1.5 px-4 py-2 text-base font-heading font-medium transition-colors duration-200 cursor-pointer"
          :class="
            activeCategoryId === String(cat.id)
              ? 'text-gold'
              : 'text-text-secondary transition-colors duration-200 hover:text-text-primary'
          "
          @click="activeCategoryId = String(cat.id)"
        >
          <component :is="iconMap[cat.icon]" v-if="iconMap[cat.icon]" class="h-4 w-4" />
          {{ cat.name }}
        </button>
        <!-- Sliding indicator with subtle glow -->
        <div
          class="pointer-events-none absolute bottom-0 h-0.5 bg-gold shadow-[0_0_12px_rgba(201,168,76,0.35)] transition-all duration-300 ease-out"
          :style="{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }"
        />
      </div>

      <!-- Sub-category scroll -->
      <div
        v-if="subCategories.length"
        class="flex gap-2 overflow-x-auto border-t border-border/50 px-4 py-3 scrollbar-hide"
      >
        <button
          class="shrink-0 rounded-full border px-4 py-1.5 text-xs transition-colors duration-200 cursor-pointer"
          :class="
            !activeSubId
              ? 'border-gold/50 bg-gold/10 text-gold'
              : 'border-border bg-transparent text-text-secondary hover:border-gold/30 hover:text-text-primary'
          "
          @click="activeSubId = ''"
        >
          全部
        </button>
        <button
          v-for="sub in subCategories"
          :key="sub.id"
          class="shrink-0 rounded-full border px-4 py-1.5 text-xs transition-colors duration-200 cursor-pointer"
          :class="
            activeSubId === String(sub.id)
              ? 'border-gold/50 bg-gold/10 text-gold'
              : 'border-border bg-transparent text-text-secondary hover:border-gold/30 hover:text-text-primary'
          "
          @click="activeSubId = String(sub.id)"
        >
          {{ sub.name }}
        </button>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="px-4 pt-6">
      <div
        v-if="filteredProducts.length"
        class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group overflow-hidden rounded-xl border border-border bg-bg-card transition-colors duration-200 hover:border-gold/30 cursor-pointer"
          @click="router.push(`/product/${product.id}`)"
        >
          <div class="relative aspect-4/3 overflow-hidden bg-bg-secondary">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              loading="lazy"
            />
            <div class="absolute top-2 left-2 flex flex-wrap gap-1">
              <span
                v-for="tag in product.tags.split(',')"
                :key="tag"
                class="rounded bg-gold/90 px-1.5 py-0.5 text-[10px] font-medium text-bg-primary"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="p-3">
            <h3 class="mb-1.5 truncate text-sm">{{ product.name }}</h3>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-base font-bold text-gold">{{ formatPrice(product.priceUSDT) }}</p>
                <p class="text-xs text-text-muted line-through">
                  {{ formatPrice(product.priceRMB, 'RMB') }}
                </p>
              </div>
              <button
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors duration-200 hover:bg-gold/20 cursor-pointer"
                aria-label="加入购物车"
                @click.stop="addToCart(product)"
              >
                <ShoppingCart class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Empty v-else text="该分类暂无商品" />
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
