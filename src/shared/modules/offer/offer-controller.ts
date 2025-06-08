import {inject, injectable} from 'inversify';
import { Controller } from '../../libs/rest/controller/base-controller.abstarct.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { HttpMethod } from '../../libs/rest/index.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Request, Response} from 'express';
import CreateOfferDto from './dto/create-offer.dto.js';
import {fillDTO} from '../../helpers/common.js';
import OfferRdo from './rdo/offer.rdo.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../libs/rest/errors/http-error.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { ParamsOfferCity, ParamsOfferLimit, ParamsOfferId } from '../../types/params-offer.types.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectId.middleware.js';
import { ValidateDtoMiddleware } from '../../middleware/validate-dto.middleware.js';
import IndexOfferRdo from './rdo/index-offer.rdo.js';
import { DocumentExistsMiddleware } from '../../middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../middleware/private-route.middleware.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ConfigInterface } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/index.js';
import { UploadImageRdo } from './rdo/upload-image.rdo.js';
import { UploadFileMiddleware } from '../../middleware/upload-file.middleware.js';
import CommentRdo from '../comment/rdo/comment.rdo.js';
@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) protected readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for ConfigController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto), new PrivateRouteMiddleware()]
    });

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getOfferList});
    this.addRoute({path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites});

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.updateOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new PrivateRouteMiddleware()
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new PrivateRouteMiddleware()
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOfferInfo,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId/addFavourite',
      method: HttpMethod.Post,
      handler: this.addFavourite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId/deleteFavourite',
      method: HttpMethod.Delete,
      handler: this.deleteFavourite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});

    this.addRoute({
      path: '/:offerId/imagePreview',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'imagePreview'),
      ]
    });

    this.addRoute({
      path: '/:offerId/commentsAmount',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create(
    {body, tokenPayload}: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response
  ) {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    this.created(res, result);
  }

  public async getOfferList({params}: Request<ParamsOfferLimit>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, fillDTO(IndexOfferRdo, offers));
  }

  public async getOfferInfo({params}: Request<ParamsOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.findOfferById(params.offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `No offer with ${params.offerId} id.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async updateOffer(
    {params, body}: Request<ParamsOfferId, UnknownRecord, UpdateOfferDto>,
    res: Response
  ) {
    const updatedOffer = await this.offerService.updateOfferById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteOffer(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    await this.offerService.deleteOfferById(params.offerId);
    this.noContent(res, 'Offer was deleted');
  }

  public async getPremium(
    {params}: Request<ParamsOfferCity>,
    res: Response
  ) {
    const offers = await this.offerService.findPremiumOffersByCity(params.city);
    this.ok(res, fillDTO(IndexOfferRdo, offers));
  }

  public async getFavourites(
    {body}: Request<UnknownRecord, UnknownRecord, { author: string }>,
    res: Response
  ) {
    const offers = await this.offerService.findFavouriteOffers(body.author);
    this.ok(res, fillDTO(IndexOfferRdo, offers));
  }

  public async addFavourite(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    await this.offerService.addToFavorites(params.offerId);
    this.ok(res, 'Offer was added to favourites');
  }

  public async deleteFavourite(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    await this.offerService.deleteFromFavorites(params.offerId);
    this.ok(res, 'Offer was deleted from favourites');
  }

  public async uploadImage({ params, file } : Request<ParamsOfferId>, res: Response) {
    const { offerId } = params;
    const updateDto = { imagePreview: file?.filename };
    await this.offerService.updateOfferById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }

  public async getComments({ params }: Request<ParamsOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
