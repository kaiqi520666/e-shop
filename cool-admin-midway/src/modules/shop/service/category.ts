import { Provide, Inject } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { ShopCategoryEntity } from '../entity/category';

@Provide()
export class ShopCategoryService extends BaseService {
  @InjectEntityModel(ShopCategoryEntity)
  categoryEntity: Repository<ShopCategoryEntity>;

  async list() {
    const categories = await this.categoryEntity.find({
      where: { parentId: IsNull(), status: 1 },
      order: { sort: 'DESC' },
    });

    const result = await Promise.all(
      categories.map(async category => {
        const subCategories = await this.categoryEntity.find({
          where: { parentId: category.id, status: 1 },
          order: { sort: 'DESC' },
          select: ['id', 'name', 'keyword'],
        });

        return {
          id: category.id, // keyword 作为 id
          name: category.name,
          keyword: category.keyword,
          icon: category.icon,
          subCategories: subCategories.map(sub => ({
            id: sub.id, // keyword 作为 id
            name: sub.name,
            keyword: sub.keyword,
          })),
        };
      })
    );

    return result;
  }
}
