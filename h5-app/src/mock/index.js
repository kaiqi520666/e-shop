import { Mock } from 'mockjs'
import {
  users,
  products,
  categories,
  banners,
  regions,
  mockOrders,
  mockTransactionRecords,
  mockCommissionRecords,
  mockTeamMembers,
  walletAddress,
  mockReviews,
  mockReviewSummary,
} from './data'

const wrap = (data, message = 'success') => ({
  code: 1000,
  data,
  message,
})

// 购物车数据存储
const mockCart = {}

const wrapError = (message, code = 1001) => ({
  code,
  data: null,
  message,
})

const generateInviteCode = () => 'INV' + Math.random().toString(36).slice(2, 6).toUpperCase()

export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const user = users.find((u) => u.username === username && u.password === password)
      if (!user) return wrapError('用户名或密码错误')
      const { password: _, ...userInfo } = user
      return wrap({
        token: 'mock-token-' + user.uid,
        user: userInfo,
      })
    },
  },

  {
    url: '/api/test',
    method: 'get',
    response: () =>
      wrap({
        message: 'test ok',
        usersCount: users.length,
        productsCount: products.length,
      }),
  },

  {
    url: '/api/categories',
    method: 'get',
    response: () => wrap(categories),
  },

  {
    url: '/api/banners',
    method: 'get',
    response: () => wrap(banners),
  },

  {
    url: '/api/products',
    method: 'get',
    response: ({ query }) => {
      let result = [...products]
      if (query.category) {
        result = result.filter((p) => p.category === query.category)
      }
      if (query.subCategory) {
        result = result.filter((p) => p.subCategory === query.subCategory)
      }
      return wrap(result)
    },
  },

  {
    url: '/api/products/:id',
    method: 'get',
    response: ({ params }) => {
      const product = products.find((p) => p.id === params.id)
      if (!product) return wrapError('商品不存在')
      return wrap(product)
    },
  },

  {
    url: '/api/user/register',
    method: 'post',
    response: ({ body }) => {
      const { username, password, phone, inviteCode } = body
      if (users.find((u) => u.username === username)) {
        return wrapError('用户名已存在')
      }
      if (users.find((u) => u.phone === phone)) {
        return wrapError('手机号已注册')
      }
      let inviter = null
      if (inviteCode) {
        inviter = users.find((u) => u.inviteCode === inviteCode)
        if (!inviter) return wrapError('邀请码无效')
      }
      const newUser = {
        uid: 'u' + Date.now(),
        username,
        password,
        phone,
        inviteCode: generateInviteCode(),
        invitedBy: inviteCode || null,
        parentId: inviter?.uid || null,
        parentChain: inviter ? `${inviter.parentChain || '/'}${inviter.uid}/` : '/',
        rebate: 0,
        invitedCount: 0,
        balance: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        agentLevel: '普通会员',
        teamCount: 0,
        teamPerformance: 0,
        commissionBalance: 0,
        commissionTotal: 0,
      }
      users.push(newUser)
      if (inviter) inviter.invitedCount++
      return wrap({ user: newUser })
    },
  },

  {
    url: '/api/user/info',
    method: 'get',
    response: ({ query }) => {
      const user = users.find((u) => u.uid === query.uid)
      if (!user) return wrapError('用户不存在')
      const { password: _, ...userInfo } = user
      return wrap(userInfo)
    },
  },

  {
    url: '/api/user/recharge',
    method: 'post',
    response: ({ body }) => {
      const { uid, amount } = body
      const user = users.find((u) => u.uid === uid)
      if (!user) return wrapError('用户不存在')
      const num = Number(amount)
      if (isNaN(num) || num <= 0) return wrapError('请输入有效金额')
      user.balance = (user.balance || 0) + num
      return wrap({ balance: user.balance })
    },
  },

  {
    url: '/api/user/withdraw',
    method: 'post',
    response: ({ body }) => {
      const { uid, amount, password } = body
      const user = users.find((u) => u.uid === uid)
      if (!user) return wrapError('用户不存在')
      // 验证密码
      if (user.password !== password) return wrapError('密码错误')
      // 使用用户绑定的钱包地址
      const address = user.walletAddress
      if (!address?.trim()) return wrapError('请先绑定钱包地址')
      const num = Number(amount)
      if (isNaN(num) || num <= 0) return wrapError('请输入有效金额')
      if (num > user.balance) return wrapError('余额不足')
      user.balance -= num
      return wrap({ balance: user.balance, address })
    },
  },

  // ========== 钱包相关 ==========
  {
    url: '/api/user/wallet',
    method: 'get',
    response: ({ query }) => {
      const user = users.find((u) => u.uid === query.uid)
      if (!user) return wrapError('用户不存在')
      return wrap({ address: user.walletAddress || '' })
    },
  },

  {
    url: '/api/user/wallet/bind',
    method: 'post',
    response: ({ body }) => {
      const { uid, address, password } = body
      const user = users.find((u) => u.uid === uid)
      if (!user) return wrapError('用户不存在')
      // 验证密码
      if (user.password !== password) return wrapError('密码错误')
      // 简单校验 TRC20 地址格式
      if (!address?.trim()) return wrapError('请输入钱包地址')
      if (!address.startsWith('T') || address.length < 34) return wrapError('请输入有效的 TRC20 地址')
      user.walletAddress = address
      return wrap({ address: user.walletAddress })
    },
  },

  {
    url: '/api/user/transactions',
    method: 'get',
    response: ({ query }) => {
      const records = mockTransactionRecords[query.uid] || []
      return wrap(records)
    },
  },

  {
    url: '/api/user/commissions',
    method: 'get',
    response: ({ query }) => {
      const records = mockCommissionRecords[query.uid] || []
      return wrap(records)
    },
  },

  {
    url: '/api/user/team',
    method: 'get',
    response: ({ query }) => {
      const members = mockTeamMembers[query.uid] || []
      return wrap(members)
    },
  },

  {
    url: '/api/orders',
    method: 'post',
    response: ({ body }) => {
      const { userId, items, address } = body
      const totalUSDT = items.reduce((sum, item) => sum + item.priceUSDT * item.quantity, 0)
      const user = users.find((u) => u.uid === userId)
      if (!user) return wrapError('用户不存在')
      if (user.balance < totalUSDT) {
        return wrapError('余额不足')
      }
      user.balance -= totalUSDT
      const order = {
        id: 'ord_' + Date.now(),
        orderNo: 'ORD_' + Date.now(),
        userId,
        items,
        totalUSDT,
        address,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      mockOrders.unshift(order)
      return wrap(order)
    },
  },

  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }) => {
      let result = mockOrders.filter((o) => o.userId === query.userId)
      if (query.status) {
        result = result.filter((o) => o.status === query.status)
      }
      return wrap(result)
    },
  },

  {
    url: '/api/orders/:id',
    method: 'get',
    response: ({ params, query }) => {
      const order = mockOrders.find((o) => o.id === params.id && o.userId === query.userId)
      if (!order) return wrapError('订单不存在')
      return wrap(order)
    },
  },

  {
    url: '/api/regions/provinces',
    method: 'get',
    response: () => wrap(regions.provinces),
  },

  {
    url: '/api/regions/cities',
    method: 'get',
    response: ({ query }) => {
      const cities = regions.cities[query.provinceCode] || []
      return wrap(cities)
    },
  },

  {
    url: '/api/regions/districts',
    method: 'get',
    response: ({ query }) => {
      const districts = regions.districts[query.cityCode] || []
      return wrap(districts)
    },
  },

  {
    url: '/api/wallet/address',
    method: 'get',
    response: () => wrap({ address: walletAddress }),
  },

  // ========== 购物车相关 ==========
  {
    url: '/api/cart',
    method: 'get',
    response: ({ query }) => {
      const { uid } = query
      const cartData = mockCart[uid] || []
      return wrap(cartData)
    },
  },

  {
    url: '/api/cart',
    method: 'post',
    response: ({ body }) => {
      const { uid, product, quantity } = body
      if (!mockCart[uid]) {
        mockCart[uid] = []
      }
      const existing = mockCart[uid].find((i) => i.productId === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        mockCart[uid].push({
          productId: product.id,
          name: product.name,
          image: product.image,
          priceRMB: product.priceRMB,
          priceUSDT: product.priceUSDT,
          quantity,
          stock: product.stock,
        })
      }
      return wrap(mockCart[uid])
    },
  },

  {
    url: '/api/cart/:productId',
    method: 'delete',
    response: ({ params, query }) => {
      const { uid } = query
      if (mockCart[uid]) {
        mockCart[uid] = mockCart[uid].filter((i) => i.productId !== params.productId)
      }
      return wrap(mockCart[uid] || [])
    },
  },

  {
    url: '/api/cart/clear',
    method: 'post',
    response: ({ body }) => {
      const { uid } = body
      mockCart[uid] = []
      return wrap([])
    },
  },

  // ========== 商品评价相关 ==========
  {
    url: '/api/reviews/summary',
    method: 'get',
    response: ({ query }) => {
      const summary = mockReviewSummary[query.productId] || {
        total: 0,
        avgRating: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0,
      }
      return wrap(summary)
    },
  },

  {
    url: '/api/reviews',
    method: 'get',
    response: ({ query }) => {
      const reviews = mockReviews[query.productId] || []
      const limit = parseInt(query.limit) || reviews.length
      return wrap(reviews.slice(0, limit))
    },
  },

  {
    url: '/api/reviews/submit',
    method: 'post',
    response: ({ body }) => {
      const { productId, userId, username, rating, content, images } = body
      if (!productId || !userId || !rating) return wrapError('参数缺失')
      const newReview = {
        id: 'r' + Date.now(),
        productId,
        userId,
        username: username ? username.slice(0, 3) + '***' : '匿名用户',
        avatar: `https://picsum.photos/seed/avatar${userId}/100/100`,
        rating: Number(rating),
        content: content || '',
        images: images || [],
        createdAt: new Date().toISOString().slice(0, 10),
        likeCount: 0,
      }
      if (!mockReviews[productId]) mockReviews[productId] = []
      mockReviews[productId].unshift(newReview)

      // 更新评价摘要
      if (!mockReviewSummary[productId]) {
        mockReviewSummary[productId] = {
          total: 0,
          avgRating: 0,
          fiveStarCount: 0,
          fourStarCount: 0,
          threeStarCount: 0,
          twoStarCount: 0,
          oneStarCount: 0,
        }
      }
      const summary = mockReviewSummary[productId]
      summary.total++
      const starKey = [
        'oneStarCount',
        'twoStarCount',
        'threeStarCount',
        'fourStarCount',
        'fiveStarCount',
      ][newReview.rating - 1]
      summary[starKey]++
      const allRatings = mockReviews[productId].map((r) => r.rating)
      summary.avgRating =
        Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10

      return wrap(newReview)
    },
  },
]
