import { provinces } from '@/constants/provinces'

const phonePattern = /^1\d{10}$/
const bankCardPattern = /^\d{12,30}$/
const idCardPattern = /^(^\d{15}$)|(^\d{17}[\dXx]$)$/
const trc20Pattern = /^T[1-9A-HJ-NP-Za-km-z]{33}$/

export const trc20AddressPattern = trc20Pattern

export const businessRechargeSchemas = {
  phone: {
    service: {
      name: '话费充值',
      color: '#00FFA3',
      amounts: [100, 200, 300, 500, 1000, 2000],
      discount: 9.8,
    },
    fields: [
      {
        key: 'name',
        label: '姓名',
        type: 'text',
        placeholder: '请输入姓名',
        required: true,
      },
      {
        key: 'phone',
        label: '充值手机号',
        type: 'tel',
        placeholder: '请输入充值手机号',
        required: true,
        validator: (value) => phonePattern.test(value),
        message: '请输入正确的充值手机号',
      },
    ],
  },
  electric: {
    service: {
      name: '电费充值',
      color: '#F59E0B',
      amounts: [500, 1000, 2000, 3000, 5000, 10000],
      discount: 9.5,
    },
    fields: [
      {
        key: 'province',
        label: '省份',
        type: 'select',
        title: '选择省份',
        placeholder: '请选择省份',
        options: provinces,
        required: true,
      },
      {
        key: 'city',
        label: '城市',
        type: 'text',
        placeholder: '请输入城市',
        required: true,
      },
      {
        key: 'accountNo',
        label: '户号',
        type: 'text',
        placeholder: '请输入户号',
        required: true,
      },
    ],
  },
  credit: {
    service: {
      name: '信用卡代还',
      color: '#8B5CF6',
      amounts: [1000, 2000, 5000, 10000, 20000, 50000],
      discount: 9.2,
    },
    fields: [
      {
        key: 'name',
        label: '姓名',
        type: 'text',
        placeholder: '请输入姓名',
        required: true,
      },
      {
        key: 'bank',
        label: '银行名称',
        type: 'text',
        placeholder: '请输入银行名称',
        required: true,
      },
      {
        key: 'branch',
        label: '开户行',
        type: 'text',
        placeholder: '请输入开户行',
        required: true,
      },
      {
        key: 'cardNo',
        label: '卡号',
        type: 'text',
        placeholder: '请输入卡号',
        required: true,
        validator: (value) => bankCardPattern.test(value),
        message: '请输入正确的银行卡号',
      },
      {
        key: 'tg',
        label: 'TG 号',
        type: 'text',
        placeholder: '请输入 TG 号',
        required: true,
      },
    ],
  },
  dxm: {
    service: {
      name: '度小满代还',
      color: '#3B82F6',
      amounts: [1000, 2000, 5000, 10000, 20000, 50000],
      discount: 9.0,
    },
    fields: [
      {
        key: 'name',
        label: '姓名',
        type: 'text',
        placeholder: '请输入姓名',
        required: true,
      },
      {
        key: 'tg',
        label: 'TG 号',
        type: 'text',
        placeholder: '请输入 TG 号',
        required: true,
      },
      {
        key: 'idCard',
        label: '身份证号',
        type: 'text',
        placeholder: '请输入身份证号',
        required: true,
        validator: (value) => idCardPattern.test(value),
        message: '请输入正确的身份证号',
      },
    ],
  },
}

export function createBusinessRechargeForm() {
  return {
    phone: '',
    province: '',
    city: '',
    accountNo: '',
    name: '',
    bank: '',
    branch: '',
    cardNo: '',
    tg: '',
    idCard: '',
  }
}

export function getBusinessRechargeSchema(type) {
  return businessRechargeSchemas[type] || businessRechargeSchemas.phone
}

export function validateBusinessRechargeForm(type, form) {
  const schema = getBusinessRechargeSchema(type)

  for (const field of schema.fields) {
    const rawValue = form[field.key]
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue

    if (field.required && !value) {
      return `请填写${field.label}`
    }

    if (value && typeof field.validator === 'function' && !field.validator(value, form)) {
      return field.message || `${field.label}格式不正确`
    }
  }

  return ''
}

export function buildBusinessRechargePayload(type, form, categoryId, rmbAmount) {
  return {
    categoryId,
    rmbAmount,
    phone: form.phone.trim(),
    address: type === 'electric' ? `${form.province}${form.city}`.trim() : '',
    accountNo: form.accountNo.trim(),
    name: form.name.trim(),
    bank: form.bank.trim(),
    branch: form.branch.trim(),
    cardNo: form.cardNo.trim(),
    tg: form.tg.trim(),
    idCard: form.idCard.trim(),
  }
}

export function isValidTrc20Address(address) {
  return trc20Pattern.test((address || '').trim())
}
