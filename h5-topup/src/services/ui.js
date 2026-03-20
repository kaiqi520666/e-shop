const noopToast = {
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
  open: () => {},
  close: () => {},
}

const noopLoading = {
  show: () => {},
  hide: () => {},
  showPage: () => {},
  hidePage: () => {},
}

const noopConfirm = {
  open: async () => false,
  confirm: () => {},
  cancel: () => {},
}

const uiServices = {
  toast: noopToast,
  loading: noopLoading,
  confirm: noopConfirm,
}

export function initUiServices(services = {}) {
  uiServices.toast = services.toast ?? noopToast
  uiServices.loading = services.loading ?? noopLoading
  uiServices.confirm = services.confirm ?? noopConfirm
}

export function getToast() {
  return uiServices.toast
}

export function getLoading() {
  return uiServices.loading
}

export function getConfirm() {
  return uiServices.confirm
}
