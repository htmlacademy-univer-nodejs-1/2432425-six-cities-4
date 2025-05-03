import {inject, injectable} from 'inversify';
import { LoggerInterface } from '../libs/logger/logger.interface.js';
import { ConfigInterface } from '../libs/config/config.interface.js';
import { RestSchema } from '../libs/config/rest.schema.js';
import { AppComponent } from '../types/app-component.enum.js';

@injectable()
export default class Application {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>
  ) {
  }

  public async init() {
    this.logger.info('Application initialized');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
