import { ref } from 'vue'

export function useCache(fetchFn, expireMs = 10 * 60 * 1000) {
  const data = ref(null)
  const cachedAt = ref(null)
  let pendingPromise = null

  const hasCachedData = () => {
    return Array.isArray(data.value)
      ? data.value.length > 0
      : data.value !== null && data.value !== undefined
  }

  async function load(force = false) {
    const expired = !cachedAt.value || Date.now() - cachedAt.value > expireMs

    if (!force && hasCachedData() && !expired) {
      return data.value
    }

    if (pendingPromise) {
      return pendingPromise
    }

    pendingPromise = (async () => {
      try {
        const result = await fetchFn()
        data.value = result
        cachedAt.value = Date.now()
        return result
      } finally {
        pendingPromise = null
      }
    })()

    return pendingPromise
  }

  function clear() {
    data.value = null
    cachedAt.value = null
    pendingPromise = null
  }

  return { data, cachedAt, load, clear }
}
