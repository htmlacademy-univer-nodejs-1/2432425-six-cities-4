import { City } from '../../../types/city.type.js';
import { Housing } from '../../../types/housing.type.js';
import {Expose} from 'class-transformer';

export default class IndexOfferRdo {
  @Expose()
  public title!: string;

  @Expose()
  public postedAt!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public imagePreview!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavourite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: Housing;

  @Expose()
  public price!: number;

  @Expose()
  public commentsAmount!: number;
}
