import { City } from '../../../types/city.type.js';
import { Housing } from '../../../types/housing.type.js';
import { Expose, Type } from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';
import { Features } from '../../../types/features.type.js';
import { Location } from '../../../types/location.type.js';

export default class OfferRdo {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postedAt!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public imagePreview!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavourite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: Housing;

  @Expose()
  public bedroomsAmount!: number;

  @Expose()
  public capacity!: number;

  @Expose()
  public price!: number;

  @Expose()
  public features!: Features[];

  @Expose({name: 'host'})
  @Type(() => UserRdo)
  public host!: string;

  @Expose()
  public commentsAmount!: number;

  @Expose()
  public location!: Location;
}
