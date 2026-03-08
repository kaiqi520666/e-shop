import { CoolController, BaseController } from '@cool-midway/core';
import { UserAddressEntity } from '../../entity/address';
import { UserAddressService } from '../../service/address';
import { UserInfoEntity } from '../../entity/info';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: UserAddressEntity,
  service: UserAddressService,
  pageQueryOp: {
    keyWordLikeFields: ['u.username'],
    select: ['a.*', 'u.username as username'],

    join: [
      {
        entity: UserInfoEntity,
        alias: 'u',
        condition: 'a.userId = u.id',
        type: 'leftJoin',
      },
    ],
  },
})
export class AdminUserAddressesController extends BaseController {}
