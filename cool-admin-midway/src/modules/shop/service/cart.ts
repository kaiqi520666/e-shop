import { Provide, Inject } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import { ShopCartEntity } from '../entity/cart';
import { ShopGoodsEntity } from '../entity/goods';

@Provide()
export class ShopCartService extends BaseService {
  @InjectEntityModel(ShopCartEntity)
  cartEntity: Repository<ShopCartEntity>;

  @InjectEntityModel(ShopGoodsEntity)
  goodsEntity: Repository<ShopGoodsEntity>;

  @Inject()
  ctx;

  private getCurrentUserId(): number {
    return this.ctx.user.id;
  }

  async add(param: { productId: number; quantity: number }) {
    const { productId, quantity } = param;
    const userId = this.getCurrentUserId();

    const goods = await this.goodsEntity.findOne({
      where: { id: productId, status: 1 },
    });
    if (!goods) {
      throw new CoolCommException('商品不存在或已下架');
    }

    if (quantity > goods.stock) {
      throw new CoolCommException('库存不足');
    }

    const existingCart = await this.cartEntity.findOne({
      where: { userId, productId },
    });

    if (existingCart) {
      const newQuantity = existingCart.quantity + quantity;
      if (newQuantity > goods.stock) {
        throw new CoolCommException('库存不足');
      }
      existingCart.quantity = newQuantity;
      await this.cartEntity.save(existingCart);
      return existingCart;
    } else {
      const newCart = await this.cartEntity.save({
        userId,
        productId,
        quantity,
      });
      return newCart;
    }
  }

  async updateQuantity(param: { id: number; quantity: number }) {
    const { id, quantity } = param;
    const userId = this.getCurrentUserId();

    const cart = await this.cartEntity.findOne({ where: { id } });
    if (!cart) {
      throw new CoolCommException('购物车记录不存在');
    }

    if (Number(cart.userId) !== Number(userId)) {
      throw new CoolCommException('无权操作');
    }

    const goods = await this.goodsEntity.findOne({
      where: { id: cart.productId, status: 1 },
    });
    if (!goods) {
      throw new CoolCommException('商品不存在或已下架');
    }

    if (quantity > goods.stock) {
      throw new CoolCommException('库存不足');
    }

    cart.quantity = quantity;
    await this.cartEntity.save(cart);
    return cart;
  }

  async remove(param: { ids: number[] }) {
    const { ids } = param;
    const userId = this.getCurrentUserId();

    // 确保是数组
    const idList = (Array.isArray(ids) ? ids : [ids]).map(Number);

    const carts = await this.cartEntity
      .createQueryBuilder('a')
      .where('a.id IN (:...ids)', { ids: idList })
      .getMany();

    if (carts.length === 0) {
      throw new CoolCommException('购物车记录不存在');
    }

    const invalidIds = carts
      .filter(c => Number(c.userId) !== Number(userId))
      .map(c => c.id);
    if (invalidIds.length > 0) {
      throw new CoolCommException('无权操作');
    }

    await this.cartEntity
      .createQueryBuilder()
      .delete()
      .where('id IN (:...ids)', { ids: idList })
      .execute();

    return true;
  }

  async clear() {
    const userId = this.getCurrentUserId();
    await this.cartEntity.delete({ userId });
    return true;
  }

  async list() {
    const userId = this.getCurrentUserId();

    const result = await this.cartEntity
      .createQueryBuilder('a')
      .select([
        'a.id as id',
        'a.productId as productId',
        'a.quantity as quantity',
        'b.name as name',
        'b.image as image',
        'b.priceRMB as priceRMB',
        'b.priceUSDT as priceUSDT',
        'b.stock as stock',
      ])
      .innerJoin('shop_goods', 'b', 'a.productId = b.id AND b.status = 1')
      .where('a.userId = :userId', { userId })
      .getRawMany();

    return result;
  }
}
