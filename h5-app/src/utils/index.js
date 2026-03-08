export function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'INV'
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function formatPrice(price, currency = 'USDT') {
  const num = Number(price)
  if (isNaN(num)) return '0.0000'
  if (currency === 'RMB') return `¥${num.toFixed(2)}`
  return `${num.toFixed(4)} USDT`
}

export function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

export function maskAddress(address) {
  if (!address || address.length < 10) return address
  return address.slice(0, 6) + '...' + address.slice(-4)
}

export function generateOrderNo() {
  const now = Date.now()
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `ORD_${now}${rand}`
}

export function delay(ms) {
  const duration = ms || Math.floor(Math.random() * 500) + 300
  return new Promise((resolve) => setTimeout(resolve, duration))
}
