import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';

import {OfferServiceInterface} from './offer-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { OfferEntity } from './offer.entity.js';
import { OfferModel } from './offer.entity.js';
import OfferService from './offer.service.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferServiceInterface>(AppComponent.OfferServiceInterface).to(OfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel).toConstantValue(OfferModel);

  return offerContainer;
}
