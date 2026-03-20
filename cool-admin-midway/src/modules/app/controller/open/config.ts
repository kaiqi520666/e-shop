import { CoolController, BaseController } from '@cool-midway/core';
import { AppConfigEntity } from '../../entity/config';

@CoolController({
  api: ['list'],
  entity: AppConfigEntity,
  listQueryOp: {
    select: ['cKey', 'cName', 'cValue'],
  },
})
export class OpenAppConfigController extends BaseController {}
