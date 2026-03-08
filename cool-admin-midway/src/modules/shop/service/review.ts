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

  async list(goodsId: number, limit = 10) {
    const reviews = await this.reviewEntity.find({
      where: { goodsId, status: 1 },
      order: { createTime: 'DESC' },
      take: limit,
    });

    const userIds = [...new Set(reviews.map(r => r.userId))];
    const userInfos = await this.userInfoEntity.find({
      where: { id: In(userIds) },
      select: ['id', 'username', 'avatarUrl'],
    });

    const userMap = new Map(userInfos.map(u => [u.id, u]));

    return reviews.map(r => {
      const user = userMap.get(r.userId);
      return {
        id: r.id,
        userId: r.userId,
        username: user?.username || '',
        avatar: user?.avatarUrl || '',
        rating: r.rating,
        content: r.content,
        images: this.parseJson(r.images, []),
        likeCount: r.likeCount,
        createTime: r.createTime,
      };
    });
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
