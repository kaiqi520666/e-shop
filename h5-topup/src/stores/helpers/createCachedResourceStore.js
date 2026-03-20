import { defineStore } from 'pinia'
import { useCache } from '@/utils/cache'

export function createCachedResourceStore(storeId, options = {}) {
  if (!storeId || typeof storeId !== 'string') {
    throw new TypeError('[createCachedResourceStore] storeId must be a non-empty string')
  }

  const {
    persistKey = storeId,
    dataKey = 'data',
    fetcher,
    expireMs = 10 * 60 * 1000,
    getters = () => ({}),
  } = options

  if (typeof fetcher !== 'function') {
    throw new TypeError(`[createCachedResourceStore:${storeId}] fetcher must be a function`)
  }

  return defineStore(
    storeId,
    () => {
      const { data, cachedAt, load, clear } = useCache(fetcher, expireMs)

      const state = {
        [dataKey]: data,
        cachedAt,
        load,
        refresh: () => load(true),
        clear,
      }

      return {
        ...state,
        ...(typeof getters === 'function' ? getters(state) : {}),
      }
    },
    {
      persist: {
        key: persistKey,
        pick: [dataKey, 'cachedAt'],
      },
    },
  )
}
