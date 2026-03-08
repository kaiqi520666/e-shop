/**
 * 级差制返佣计算工具
 * 返佣规则：上级代理获得自身返点与下级返点之差的佣金
 */

/**
 * 计算级差制佣金
 * @param {number} orderAmount - 订单金额（USDT）
 * @param {Array} agentHierarchy - 从顶级代理到最下级的数组，每个元素包含 { uid, rebate }
 * @returns {Array} 每个代理获得的佣金数组 [{ uid, commission }]
 */
export function calculateCommission(orderAmount, agentHierarchy) {
  if (!orderAmount || orderAmount <= 0 || !agentHierarchy || agentHierarchy.length === 0) {
    return []
  }

  const results = []

  for (let i = 0; i < agentHierarchy.length - 1; i++) {
    const currentAgent = agentHierarchy[i]
    const nextAgent = agentHierarchy[i + 1]

    const currentRebate = currentAgent.rebate || 0
    const nextRebate = nextAgent.rebate || 0

    const rebateDiff = currentRebate - nextRebate

    if (rebateDiff > 0) {
      const commission = (orderAmount * rebateDiff) / 100
      results.push({
        uid: currentAgent.uid,
        rebate: currentRebate,
        nextRebate: nextRebate,
        rebateDiff,
        commission: Math.round(commission * 100) / 100,
      })
    }
  }

  return results
}

/**
 * 计算单个代理可获得的返佣（基于其所有下级的订单）
 * @param {number} orderAmount - 订单金额
 * @param {number} selfRebate - 自身返点百分比
 * @param {number} directSubRebate - 直属下级返点百分比
 * @returns {number} 佣金金额
 */
export function calculateSingleCommission(orderAmount, selfRebate, directSubRebate) {
  const rebateDiff = selfRebate - directSubRebate
  if (rebateDiff <= 0) return 0
  return Math.round((orderAmount * rebateDiff) / 100 * 100) / 100
}

/**
 * 获取代理的直属下级返点列表
 * @param {string} parentUid - 父级代理UID
 * @param {Array} allMembers - 所有团队成员
 * @returns {Array} 直属下级成员列表
 */
export function getDirectSubordinates(parentUid, allMembers) {
  if (!allMembers || !parentUid) return []
  return allMembers.filter((m) => m.parentChain === `/${parentUid}/`)
}

/**
 * 验证返点设置是否合法
 * @param {number} currentRebate - 当前代理的返点
 * @param {number} newRebate - 新设置的返点
 * @param {number} currentSubRebate - 下级当前已设置的返点
 * @returns {{ valid: boolean, message: string }}
 */
export function validateRebateSetting(currentRebate, newRebate, currentSubRebate = 0) {
  if (newRebate < 0 || newRebate > 100) {
    return { valid: false, message: '返点值必须在 0-100% 之间' }
  }

  if (newRebate > currentRebate) {
    return { valid: false, message: `返点不能超过自身返点 ${currentRebate}%` }
  }

  if (newRebate < currentSubRebate) {
    return { valid: false, message: `返点不能低于下级当前返点 ${currentSubRebate}%` }
  }

  return { valid: true, message: '' }
}
