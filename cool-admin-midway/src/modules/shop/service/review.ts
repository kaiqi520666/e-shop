import { Provide, Inject } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import { ShopReviewEntity } from '../entity/review';
import { UserInfoEntity } from '../../user/entity/info';
import { CoolCommException } from '@cool-midway/core';

@Provide()
export class ShopReviewService extends BaseService {
  @InjectEntityModel(ShopReviewEntity)
  reviewEntity: Repository<ShopReviewEntity>;

  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  async summary(goodsId: number) {
    const reviews = await this.reviewEntity.find({
      where: { goodsId, status: 1 },
    });

    const total = reviews.length;
    let avgRating = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (total > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = Number((sum / total).toFixed(1));
      reviews.forEach(r => {
        ratingCounts[r.rating as keyof typeof ratingCounts]++;
      });
    }

    return {
      total,
      avgRating,
      fiveStarCount: ratingCounts[5],
      fourStarCount: ratingCounts[4],
      threeStarCount: ratingCounts[3],
      twoStarCount: ratingCounts[2],
      oneStarCount: ratingCounts[1],
    };
  }

  async list(goodsId: number) {
    const reviews = await this.reviewEntity
      .createQueryBuilder('r')
      .leftJoin('user_info', 'u', 'u.id = r.userId')
      .select([
        'r.id as id',
        'r.userId as userId',
        'r.rating as rating',
        'r.content as content',
        'r.likeCount as likeCount',
        'r.createTime as createTime',
      ])
      .addSelect(['u.username as username'])
      .where('r.goodsId = :goodsId', { goodsId })
      .andWhere('r.status = 1')
      .orderBy('r.createTime', 'DESC')
      .getRawMany();

    //对reviews进行处理,username脱敏,只保留前三位后面用*代替，createTime只保留年月日
    reviews.forEach((r: any) => {
      r.username = r.username.slice(0, 3) + '*'.repeat(r.username.length - 3);
      r.createTime = '';
    });

    return reviews;
  }

  async submit(
    userId: number,
    goodsId: number,
    rating: number,
    content?: string,
    images?: string[]
  ) {
    const existing = await this.reviewEntity.findOne({
      where: { userId, goodsId },
    });

    if (existing) {
      throw new CoolCommException('该商品已评价');
    }

    const data: Partial<ShopReviewEntity> = {
      userId,
      goodsId,
      rating,
      content,
      images: images || undefined,
      status: 1,
    };

    return this.reviewEntity.save(data);
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
