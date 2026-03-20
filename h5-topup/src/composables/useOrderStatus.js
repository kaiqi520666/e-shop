import {
  Zap,
  Landmark,
  CreditCard,
  Wallet,
  Clock,
  Loader,
  CheckCircle,
  XCircle,
} from 'lucide-vue-next'

const ORDER_ICONS = {
  phone: Zap,
  electric: Landmark,
  credit: CreditCard,
  dxm: Wallet,
}

// status: 0-等待充值, 1-正在充值, 2-充值成功, 3-订单取消
const STATUS_MAP = {
  0: {
    // 等待充值
    label: '等待充值',
    icon: Clock,
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-400',
    badgeClass: 'bg-yellow-500/20 text-yellow-400',
  },
  1: {
    // 正在充值
    label: '正在充值',
    icon: Loader,
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-400',
    badgeClass: 'bg-blue-500/20 text-blue-400',
  },
  2: {
    // 充值成功
    label: '充值成功',
    icon: CheckCircle,
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-400',
    badgeClass: 'bg-green-500/20 text-green-400',
  },
  3: {
    // 订单取消
    label: '订单取消',
    icon: XCircle,
    bgClass: 'bg-gray-500/20',
    textClass: 'text-gray-400',
    badgeClass: 'bg-gray-500/20 text-gray-400',
  },
}

const FALLBACK_STATUS = {
  icon: Clock,
  bgClass: 'bg-gray-500/20',
  textClass: 'text-gray-400',
  badgeClass: 'bg-gray-500/20 text-gray-400',
  label: '未知状态',
}

export function useOrderStatus() {
  const getOrderIcon = (type) => ORDER_ICONS[type] ?? Zap
  const getStatusLabel = (status) => STATUS_MAP[status]?.label ?? '未知状态'
  const getStatusIcon = (status) => STATUS_MAP[status]?.icon ?? FALLBACK_STATUS.icon
  const getStatusBgClass = (status) => STATUS_MAP[status]?.bgClass ?? FALLBACK_STATUS.bgClass
  const getStatusTextClass = (status) => STATUS_MAP[status]?.textClass ?? FALLBACK_STATUS.textClass
  const getStatusBadgeClass = (status) =>
    STATUS_MAP[status]?.badgeClass ?? FALLBACK_STATUS.badgeClass
  const getStatusText = (status) => STATUS_MAP[status]?.label ?? FALLBACK_STATUS.label
  return {
    getOrderIcon,
    getStatusLabel,
    getStatusIcon,
    getStatusBgClass,
    getStatusTextClass,
    getStatusBadgeClass,
    getStatusText,
  }
}
