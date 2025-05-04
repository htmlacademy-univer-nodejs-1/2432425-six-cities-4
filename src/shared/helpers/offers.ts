import {Offer} from '../types/offer.type.js';
import { City } from '../types/city.type.js';
import { Housing } from '../types/housing.type.js';
import { Features } from '../types/features.type.js';
import { User } from '../types/host.type.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    postedAt,
    city,
    imagePreview,
    photos,
    isPremium,
    isFavourite,
    rating,
    housingType,
    bedroomsAmount,
    capacity,
    price,
    features,
    host,
    commentsAmount,
    location] = offerData.replace('\n', '').split('\t');

  return {
    title,
    description,
    postedAt: new Date(postedAt),
    city: city as City,
    imagePreview,
    photos: photos.split(';'),
    isPremium: isPremium as unknown as boolean,
    isFavourite: isFavourite as unknown as boolean,
    rating: Number.parseInt(rating, 10),
    housing: housingType as Housing,
    bedroomsAmount: Number.parseInt(bedroomsAmount, 10),
    capacity: Number.parseInt(capacity, 10),
    price: Number.parseInt(price, 10),
    features: features.split(';') as unknown as Features,
    host: host as unknown as User,
    commentsAmount: Number.parseInt(commentsAmount, 10),
    location: location.split(',').map((number) =>
      Number.parseFloat(number)) as unknown as Features
  } as unknown as Offer;
}
