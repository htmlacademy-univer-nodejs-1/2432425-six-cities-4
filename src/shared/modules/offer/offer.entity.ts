/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Housing } from '../../types/housing.type.js';
import { Features } from '../../types/features.type.js';
import { Location } from '../../types/location.type.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true, minlength: 10, maxlength: 100})
  public title!: string;

  @prop({required: true, trim: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public postedAt!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: City
  })
  public city!: City;

  @prop({required: true})
  public imagePreview!: string;

  @prop({
    required: true,
    type: () => String
  })
  public photos!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true})
  public isFavourite!: boolean;

  @prop({required: true, min: 1, max: 5})
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: Housing
  })
  public housingType!: Housing;

  @prop({required: true, min: 1, max: 8})
  public bedroomsAmount!: number;

  @prop({required: true, min: 1, max: 10})
  public capacity!: number;

  @prop({required: true, min: 100, max: 100000})
  public price!: number;

  @prop({
    required: true,
    type: () => String,
    enum: Features
  })
  public features!: Features[];

  @prop({
    required: true,
    ref: UserEntity
  })
  public host!: Ref<UserEntity>;

  @prop({default: 0})
  public commentsAmount!: number;

  @prop({required: true})
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
