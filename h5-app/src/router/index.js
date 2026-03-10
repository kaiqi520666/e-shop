import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/category/:id?',
    name: 'category',
    component: () => import('@/views/CategoryView.vue'),
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/views/ProductView.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/order-success',
    name: 'orderSuccess',
    component: () => import('@/views/OrderSuccessView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orderList',
    component: () => import('@/views/OrderListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id',
    name: 'orderDetail',
    component: () => import('@/views/OrderDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/recharge',
    name: 'recharge',
    component: () => import('@/views/RechargeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('@/views/WithdrawView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/agent',
    name: 'agent',
    component: () => import('@/views/AgentView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/TransactionRecordView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/address',
    name: 'addressList',
    component: () => import('@/views/AddressListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/address/form/:id?',
    name: 'addressForm',
    component: () => import('@/views/AddressFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/notices',
    name: 'notices',
    component: () => import('@/views/NoticeListView.vue'),
  },
  {
    path: '/notices/:id',
    name: 'noticeDetail',
    component: () => import('@/views/NoticeDetailView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
})

export default router
