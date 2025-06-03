import { Container } from 'inversify';
import { AuthService } from './auth-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { DefaultAuthService } from './default-auth.service.js';
import { ExceptionFilterInterface } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(AppComponent.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilterInterface>(AppComponent.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
