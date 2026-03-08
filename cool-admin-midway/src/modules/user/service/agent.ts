import { Provide } from '@midwayjs/core';
import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Like, MoreThan, Repository } from 'typeorm';
import { UserInfoEntity } from '../entity/info';
import { UserCommissionEntity } from '../entity/commission';

/**
 * 用户代理
 */
@Provide()
export class UserAgentService extends BaseService {
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @InjectEntityModel(UserCommissionEntity)
  commissionEntity: Repository<UserCommissionEntity>;

  /**
   * 获取佣金记录
   * @param userId 用户ID
   * @param query 查询参数
   */
  async commissions(userId: number, query: any) {
    const { page = 1, size = 10 } = query;
    const [list, total] = await this.commissionEntity.findAndCount({
      where: { agentId: Equal(userId) },
      order: { createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      list,
      pagination: {
        page,
        size,
        total,
      },
    };
  }

  /**
   * 获取团队成员
   * @param userId 用户ID
   */
  async team(userId: number) {
    // 用 ancestorPath 一次查出所有下级（无限层级）
    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) return [];

    // 当前用户的路径前缀，查所有下级
    const allChildren = await this.userInfoEntity.find({
      where: [
        { parentId: Equal(userId) }, // 直属下级
        { ancestorPath: Like(`${user.ancestorPath}${userId}/%`) }, // 所有间接下级
      ],
    });

    // 根据 ancestorPath 计算每个成员的层级深度
    const baseDepth = user.ancestorPath.split('/').filter(Boolean).length;

    return allChildren.map(c => ({
      id: c.id,
      username: c.username,
      phone: this.maskPhone(c.phone),
      commissionRate: c.commissionRate,
      createTime: c.createTime,
      // 当前成员的深度 - 根用户的深度 = 相对层级
      level: c.ancestorPath.split('/').filter(Boolean).length - baseDepth,
    }));
  }

  /**
   * 手机号脱敏
   */
  private maskPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
  }

  /**
   * 设置下级分成比例
   * @param agentId 代理ID（设置者）
   * @param subUserId 下级用户ID
   * @param rate 分成比例（上级给下级的比例，如0.08=8%）
   */
  async setSubRate(agentId: number, subUserId: number, rate: number) {
    // 校验下级是否存在
    const subUser = await this.userInfoEntity.findOneBy({
      id: Equal(subUserId),
    });
    if (!subUser) {
      throw new CoolCommException('下级用户不存在');
    }

    // 校验是否为直属下级
    if (Number(subUser.parentId) !== agentId) {
      throw new CoolCommException('非直属下级');
    }

    // 获取代理信息
    const agent = await this.userInfoEntity.findOneBy({ id: Equal(agentId) });
    if (!agent) {
      throw new CoolCommException('代理不存在');
    }

    // 校验给下级的比例不能超过自己的比例
    if (rate >= Number(agent.commissionRate)) {
      throw new CoolCommException('下级比例不能大于或等于自己的比例');
    }

    // 更新下级分成比例
    await this.userInfoEntity.update(
      { id: subUserId },
      { commissionRate: rate }
    );

    return { success: true };
  }

  //获取除自己之外所有下级数量
  async getSubUserCount(userId: number) {
    // 1. 先查自己的 ancestorPath
    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user) return 0;

    // 2. 用自己的 ancestorPath 作为前缀查询
    // 下级的 ancestorPath 会是 /1/5/userId/ 这种格式
    const count = await this.userInfoEntity.count({
      where: {
        ancestorPath: Like(`${user.ancestorPath}${userId}/%`),
      },
    });

    return count;
  }

  /**
   * 计算订单佣金（级差制）
   * @param userId 消费者用户ID
   * @param orderId 订单ID
   * @param orderAmount 订单金额
   */
  @CoolTransaction({ connectionName: 'default' })
  async calculateCommission(
    userId: number,
    orderId: number,
    orderAmount: number
  ) {
    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user || !user.parentId) return; // 无上级直接返回

    // ancestors 必须是从最近到最远排列：[直属上级, 上上级, ...]
    // 即：[B, A] （B是C的直属上级，A是B的直属上级）
    const ancestors = await this.getAncestors(userId);
    if (!ancestors.length) return;

    // 构建完整链：[消费者, 直属上级, 上上级, ...]
    // 对应比例：[user.commissionRate, B.commissionRate, A.commissionRate, ...]
    const chain = [user, ...ancestors];

    for (let i = 0; i < ancestors.length; i++) {
      const ancestor = ancestors[i]; // 当前受益代理
      const ancestorRate = Number(ancestor.commissionRate);
      const lowerRate = Number(chain[i].commissionRate); // 下一级的比例

      // 级差 = 自己比例 - 直接下级比例
      const diffRate = ancestorRate - lowerRate;

      if (diffRate <= 0) continue;

      const amount = Number((orderAmount * diffRate).toFixed(2));

      await this.commissionEntity.insert({
        orderId,
        agentId: ancestor.id,
        userId,
        orderAmount,
        rate: diffRate,
        amount,
        depth: i + 1,
        status: 0,
      });

      await this.userInfoEntity.increment(
        { id: ancestor.id },
        'balance',
        amount
      );
      await this.userInfoEntity.increment(
        { id: ancestor.id },
        'totalIncome',
        amount
      );
    }
  }

  /**
   * 获取用户的所有上级代理（按层级排序，从近到远）
   */
  private async getAncestors(userId: number): Promise<UserInfoEntity[]> {
    const user = await this.userInfoEntity.findOneBy({ id: Equal(userId) });
    if (!user || !user.parentId || user.ancestorPath === '/') return [];

    // 从 ancestorPath '/1/5/23/' 提取所有祖先ID
    const ancestorIds = user.ancestorPath
      .split('/')
      .filter(Boolean)
      .map(Number);

    if (!ancestorIds.length) return [];

    // 一次查出所有祖先
    const ancestors = await this.userInfoEntity.findBy({
      id: In(ancestorIds),
      commissionRate: MoreThan(0), // 只取代理
    });

    // 按 ancestorPath 中的顺序排列，然后反转（从近到远）
    // ancestorPath = '/1/5/' 表示 1 是根，5 是父，所以反转后是 [5, 1]
    const sorted = ancestorIds
      .map(id => ancestors.find(a => a.id === id))
      .filter(Boolean) as UserInfoEntity[];

    return sorted.reverse();
  }
}
