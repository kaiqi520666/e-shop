import { createCachedResourceStore } from '@/stores/helpers/createCachedResourceStore'
import { categoryApi } from '@/api'

export const useCategoryStore = createCachedResourceStore('category', {
  dataKey: 'categoryList',
  fetcher: async () => {
    const res = await categoryApi.getCategoryList()
    return res.data
  },
  getters: ({ categoryList }) => ({
    getCategoryByKeyword(keyword) {
      return categoryList.value.find((item) => item.keyword === keyword)
    },
  }),
})
