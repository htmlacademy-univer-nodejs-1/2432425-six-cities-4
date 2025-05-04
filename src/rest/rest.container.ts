import {Container} from 'inversify';
import Application from './rest.application.js';
import { AppComponent } from '../shared/types/app-component.enum.js';
import { LoggerInterface } from '../shared/libs/logger/logger.interface.js';
import PinoService from '../shared/libs/logger/pino.service.js';
import { ConfigInterface } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import ConfigService from '../shared/libs/config/config.service.js';
import { DatabaseClientInterface } from '../shared/libs/database-client/database-client.interface.js';
import MongoClientService from '../shared/libs/database-client/mongo-client.service.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();
  restApplicationContainer.bind<Application>(AppComponent.Application).to(Application).inSingletonScope();
  restApplicationContainer.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  restApplicationContainer.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();
  restApplicationContainer.bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface).to(MongoClientService).inSingletonScope();

  return restApplicationContainer;
}
