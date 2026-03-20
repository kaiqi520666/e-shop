const noopUnauthorizedHandler = () => {}

let unauthorizedHandler = noopUnauthorizedHandler
const publicPaths = new Set(['/', '/login', '/register', '/notice'])

export function initSessionHandlers({ onUnauthorized } = {}) {
  unauthorizedHandler = onUnauthorized ?? noopUnauthorizedHandler
}

export function handleUnauthorized() {
  unauthorizedHandler()
}

export function isPublicPath(path) {
  if (publicPaths.has(path)) {
    return true
  }

  return /^\/notice\/[^/]+$/.test(path)
}

export function buildLoginLocation(redirectPath = '') {
  if (!redirectPath) {
    return '/login'
  }

  return {
    path: '/login',
    query: {
      redirect: redirectPath,
    },
  }
}

export function resolveLoginRedirect(redirect) {
  if (typeof redirect !== 'string' || !redirect.startsWith('/')) {
    return '/'
  }

  return redirect
}
