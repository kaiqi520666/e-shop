import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopBannerEntity } from '../entity/banner';

@Provide()
export class ShopBannerService extends BaseService {
  @InjectEntityModel(ShopBannerEntity)
  bannerEntity: Repository<ShopBannerEntity>;

  async list() {
    return this.bannerEntity.find({
      where: { status: 1 },
      order: { sort: 'DESC' },
    });
  }
}
