import { CoolController, BaseController } from '@cool-midway/core';
import { TopupOrderEntity } from '../../entity/order';
import { UserInfoEntity } from '../../../user/entity/info';
import { TopupCategoryEntity } from '../../entity/category';
import { TopupOrderService } from '../../service/order';

/**
 * 充值订单
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  serviceApis: ['success'],
  entity: TopupOrderEntity,
  service: TopupOrderService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo', 'b.username'],
    select: ['a.*', 'b.username as username', 'c.name as categoryName'],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
        type: 'innerJoin',
      },
      {
        entity: TopupCategoryEntity,
        alias: 'c',
        condition: 'a.categoryId = c.id',
        type: 'innerJoin',
      },
    ],
  },
})
export class AdminTopupOrderController extends BaseController {}
