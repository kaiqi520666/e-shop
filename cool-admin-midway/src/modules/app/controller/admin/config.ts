import { CoolController, BaseController } from '@cool-midway/core';
import { AppConfigEntity } from '../../entity/config';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: AppConfigEntity,
})
export class AdminAppConfigController extends BaseController {}
