import 'reflect-metadata';
import {Container} from 'inversify';

import PinoService from './libs/logger/pino.service.js';
import Application from './rest/rest.application.js';
import ConfigService from './libs/config/config.service.js';
import { AppComponent } from './types/app-component.enum.js';
import { LoggerInterface } from './libs/logger/logger.interface.js';
import { ConfigInterface } from './libs/config/config.interface.js';
import { RestSchema } from './libs/config/rest.schema.js';

async function bootstrap() {
  const container = new Container();
  container.bind<Application>(AppComponent.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();

  const application = container.get<Application>(AppComponent.Application);
  await application.init();
}

bootstrap();
