import 'reflect-metadata';
import { Container } from 'inversify';

import Application from './rest/rest.application.js';
import { AppComponent } from './shared/types/app-component.enum.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer()
  );

  const application = mainContainer.get<Application>(AppComponent.Application);
  await application.init();
}

bootstrap();
