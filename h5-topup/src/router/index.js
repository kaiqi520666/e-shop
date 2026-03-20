import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore, useUserStore } from '@/stores'
import { buildLoginLocation, resolveLoginRedirect } from '@/services/session'

const HomeView = () => import('../views/HomeView.vue')
const NoticeView = () => import('../views/NoticeView.vue')
const NoticeDetailView = () => import('../views/NoticeDetailView.vue')
const OrdersView = () => import('../views/OrdersView.vue')
const OrderDetailView = () => import('../views/OrderDetailView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const AgentView = () => import('../views/AgentView.vue')
const RechargeView = () => import('../views/RechargeView.vue')
const BusinessRechargeView = () => import('../views/BusinessRechargeView.vue')
const WithdrawView = () => import('../views/WithdrawView.vue')
const WalletView = () => import('../views/WalletView.vue')
const RecordsView = () => import('../views/RecordsView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { public: true },
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticeView,
      meta: { public: true },
    },
    {
      path: '/notice/:id',
      name: 'notice-detail',
      component: NoticeDetailView,
      meta: { public: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
    },
    {
      path: '/orders/:orderNo',
      name: 'order-detail',
      component: OrderDetailView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/agent',
      name: 'agent',
      component: AgentView,
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: RechargeView,
    },
    {
      path: '/recharge/:type',
      name: 'business-recharge',
      component: BusinessRechargeView,
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: WithdrawView,
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletView,
    },
    {
      path: '/records',
      name: 'records',
      component: RecordsView,
    },
  ],
})

const hidePageLoading = () => {
  window.requestAnimationFrame(() => {
    useLoadingStore().hidePage()
  })
}

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const loadingStore = useLoadingStore()

  if (to.fullPath !== from.fullPath) {
    loadingStore.showPage()
  }

  const isPublic = to.matched.some((record) => record.meta.public)

  if (userStore.isLoggedIn) {
    if (to.path === '/login' || to.path === '/register') {
      return resolveLoginRedirect(to.query.redirect)
    }
    return
  }

  if (isPublic) {
    return
  }

  return buildLoginLocation(to.fullPath)
})

router.afterEach(() => {
  hidePageLoading()
})

router.onError(() => {
  useLoadingStore().hidePage()
})

export default router
