import {inject, injectable} from 'inversify';
import {OfferServiceInterface} from './offer-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {DEFAULT_OFFER_COUNT, MAX_PREMIUM_OFFER_COUNT} from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {
  }

  public async deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity, types.BeAnObject> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateOfferById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity, types.BeAnObject> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate('host')
      .exec();
  }

  public async find(count: number): Promise<DocumentType<OfferEntity, types.BeAnObject>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel
      .find()
      .sort({createdAt: SortType.Down})
      .limit(limit)
      .populate('host')
      .exec();
  }

  public async findPremiumOffersByCity(city: string): Promise<DocumentType<OfferEntity, types.BeAnObject>[]> {
    return this.offerModel
      .find({city: city, isPremium: true})
      .sort({createdAt: SortType.Down})
      .limit(MAX_PREMIUM_OFFER_COUNT)
      .populate('host')
      .exec();
  }

  public async findFavouriteOffers(userId: string): Promise<DocumentType<OfferEntity, types.BeAnObject>[]> {
    console.info(userId);
    return this.offerModel
      .find({isFavourite: true, host: userId})
      .populate('host')
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity, types.BeAnObject> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {
      '$inc': {
        commentsAmount: 1,
      }
    }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created ${dto.title}`);

    return result;
  }

  public async findOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate('host')
      .exec();
  }

  public async updateRating(offerId: string, newRating: number): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, {rating: newRating}).exec();
  }

  public async addToFavorites(offerId: string): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, {isFavourite: true});
  }

  public async deleteFromFavorites(offerId: string): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, {isFavourite: false});
  }
}
