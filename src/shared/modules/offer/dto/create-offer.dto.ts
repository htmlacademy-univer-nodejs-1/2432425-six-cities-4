import { City } from '../../../types/city.type.js';
import { Housing } from '../../../types/housing.type.js';
import { Features } from '../../../types/features.type.js';
import { Location } from '../../../types/location.type.js';

export default class CreateOfferDto {
  title!: string;
  description!: string;
  postedAt!: Date;
  city!: City;
  imagePreview!: string;
  photos!: string[];
  isPremium!: boolean;
  isFavourite!: boolean;
  rating!: number;
  housingType!: Housing;
  bedroomsAmount!: number;
  capacity!: number;
  price!: number;
  features!: Features[];
  host!: string;
  commentsAmount!: number;
  location!: Location;
}
