import {Container} from 'inversify';
import Application from './rest.application.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import PinoService from '../logger/pino.service.js';
import { ConfigInterface } from '../config/config.interface.js';
import { RestSchema } from '../config/rest.schema.js';
import ConfigService from '../config/config.service.js';
import { DatabaseClientInterface } from '../database-client/database-client.interface.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import { ExceptionFilterInterface } from './exception-filters/exception-filter.interface.js';
import { AppExceptionFilter } from './exception-filters/app.exception-filter.js';
import { HttpErrorExceptionFilter } from './exception-filters/http-error.exception-filter.js';
import { ValidationExceptionFilter } from './exception-filters/validation.exception-filter.js';
import { PathTransformer } from './transform/path-transformer.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();
  restApplicationContainer.bind<Application>(AppComponent.Application).to(Application).inSingletonScope();
  restApplicationContainer.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  restApplicationContainer.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();
  restApplicationContainer.bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface).to(MongoClientService).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilterInterface>(AppComponent.ExceptionFilterInterface).to(AppExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilterInterface>(AppComponent.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilterInterface>(AppComponent.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<PathTransformer>(AppComponent.PathTransformer).to(PathTransformer).inSingletonScope();

  return restApplicationContainer;
}
