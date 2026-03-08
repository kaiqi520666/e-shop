import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'
import { bannerApi } from '@/api/modules/shop/banner.api'
import { categoryApi } from '@/api/modules/shop/category.api'
import { goodsApi } from '@/api/modules/shop/goods.api'

export const useProductStore = defineStore('product', () => {
  const productList = ref([])
  const categoryList = ref([])
  const banners = ref([])
  const loading = ref(false)

  async function fetchProducts(categoryId) {
    loading.value = true
    try {
      const params = {}
      if (categoryId) params.categoryId = categoryId
      const res = await goodsApi.getGoodsList(params)
      productList.value = res.data
    } catch (error) {
      console.error('获取产品列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id) {
    try {
      const res = await goodsApi.getGoodsById(id)
      return res.data
    } catch {
      return null
    }
  }

  async function fetchCategories() {
    try {
      const res = await categoryApi.getCategoryList()
      categoryList.value = res.data
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  async function fetchBanners() {
    try {
      const res = await bannerApi.getBannerList()
      banners.value = res.data
    } catch (error) {
      console.error('获取轮播图失败:', error)
    }
  }

  async function getById(id) {
    const res = await goodsApi.getGoodsById(id)
    return res.data
  }

  function getByCategory(subCategoryId, mainCategoryId) {
    // 如果传了 subCategoryId，精确匹配子分类
    if (subCategoryId) {
      return productList.value.filter((p) => String(p.categoryId) === String(subCategoryId))
    }
    // 如果传了 mainCategoryId，匹配该主分类下所有子分类的商品
    if (mainCategoryId) {
      // 获取主分类下的所有子分类 ID
      const category = categoryList.value.find((c) => String(c.id) === String(mainCategoryId))
      if (category && category.subCategories) {
        const subIds = category.subCategories.map((sub) => String(sub.id))
        return productList.value.filter((p) => subIds.includes(String(p.categoryId)))
      }
    }
    return []
  }

  function getBySubCategory(subCategoryId) {
    return productList.value.filter((p) => String(p.subCategory) === String(subCategoryId))
  }

  function getHotProducts(limit = 6) {
    return productList.value.filter((p) => p.tags?.includes('热销')).slice(0, limit)
  }

  function getNewProducts(limit = 6) {
    return productList.value.filter((p) => p.tags?.includes('新品')).slice(0, limit)
  }

  return {
    productList,
    categoryList,
    banners,
    loading,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchBanners,
    getById,
    getByCategory,
    getBySubCategory,
    getHotProducts,
    getNewProducts,
  }
})
