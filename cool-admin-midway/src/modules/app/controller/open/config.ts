import { CoolController, BaseController } from '@cool-midway/core';
import { AppConfigEntity } from '../../entity/config';

@CoolController({
  api: ['list'],
  entity: AppConfigEntity,
})
export class OpenAppConfigController extends BaseController {}
