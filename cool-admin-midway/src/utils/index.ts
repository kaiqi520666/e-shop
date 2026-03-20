import * as md5 from 'md5';
/**
 * 生成订单号（时间戳+6位随机数）
 */
export function generateOrderNo(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${timestamp}${random}`;
}

export const EPUSDT_API_URL =
  'https://upay.fdshop.top/api/v1/order/create-transaction';

export const EPUSDT_CHECK_URL = 'https://upay.fdshop.top/pay/check-status/';
export const EPUSDT_TOKEN = 'epusdt_token';

export function generateSignature(params: Record<string, any>): string {
  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys
    .filter(
      key =>
        params[key] !== '' && params[key] !== null && params[key] !== undefined
    )
    .map(key => `${key}=${params[key]}`)
    .join('&');
  const signature = md5(signStr + EPUSDT_TOKEN);
  return signature;
}

export const TOPUP_RECHARGE_NOTIFY_URL =
  'https://api.fdshop.top/open/topup/recharge/notify';
