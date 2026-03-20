export const toSafeNumber = (value, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    if (!normalized) {
      return fallback
    }
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const formatMoney = (value, digits = 2) => {
  return toSafeNumber(value).toFixed(digits)
}

export const formatUsdt = (value, digits = 4) => {
  return toSafeNumber(value).toFixed(digits)
}
