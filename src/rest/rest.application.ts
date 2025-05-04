import { LoggerInterface } from '../shared/libs/logger/logger.interface.js';
import { ConfigInterface } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import {inject, injectable} from 'inversify';
import { AppComponent } from '../shared/types/app-component.enum.js';
import { DatabaseClientInterface } from '../shared/libs/database-client/database-client.interface.js';
import { getMongoURI } from '../shared/helpers/database.js';

@injectable()
export default class Application {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface
  ) {
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    return this.databaseClient.connect(mongoUri);
  }


  public async init() {
    this.logger.info('Application initialized');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this._initDb();
    this.logger.info('Init database completed');
  }
}
