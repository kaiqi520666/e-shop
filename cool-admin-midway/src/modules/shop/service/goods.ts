import { Provide, Inject } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import { ShopGoodsEntity } from '../entity/goods';
import { ShopCategoryEntity } from '../entity/category';

@Provide()
export class ShopGoodsService extends BaseService {
  @InjectEntityModel(ShopGoodsEntity)
  goodsEntity: Repository<ShopGoodsEntity>;

  @InjectEntityModel(ShopCategoryEntity)
  categoryEntity: Repository<ShopCategoryEntity>;

  async list(categoryId?: number) {
    let categoryIds: number[] = [];

    if (categoryId) {
      categoryIds = await this.getAllChildCategoryIds(categoryId);
    }

    const where: any = { status: 1 };
    if (categoryIds.length > 0) {
      where.categoryId = In(categoryIds);
    }

    const goodsList = await this.goodsEntity.find({
      where,
      order: { sort: 'DESC' },
      select: [
        'id',
        'name',
        'categoryId',
        'priceRMB',
        'priceUSDT',
        'stock',
        'tags',
        'image',
        'images',
      ],
    });

    return goodsList;
  }

  // 递归获取所有子孙分类ID
  private async getAllChildCategoryIds(parentId: number): Promise<number[]> {
    const result: number[] = [parentId];
    const children = await this.categoryEntity.find({
      where: { parentId, status: 1 },
      select: ['id'],
    });

    for (const child of children) {
      const grandchildren = await this.getAllChildCategoryIds(child.id);
      result.push(...grandchildren);
    }

    return result;
  }

  async info(id: number) {
    const goods = await this.goodsEntity.findOne({
      where: { id },
    });
    if (!goods) {
      return null;
    }
    return goods;
  }

  private parseJson(value: any, defaultValue: any): any {
    if (!value) return defaultValue;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}
