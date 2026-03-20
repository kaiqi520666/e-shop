import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';

import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

import { TopupCategoryEntity } from '../entity/category';

@Provide()
export class TopupCategoryService extends BaseService {
  @InjectEntityModel(TopupCategoryEntity)
  topupCategoryEntity: Repository<TopupCategoryEntity>;

  async list() {
    return this.topupCategoryEntity.find({
      where: { status: 1 },
      order: { sort: 'DESC' },
    });
  }
}
