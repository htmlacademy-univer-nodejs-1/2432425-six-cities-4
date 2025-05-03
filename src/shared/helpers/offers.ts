import {Offer} from '../../types/offer.type.js';
import { City } from '../../types/city.type.js';
import { Housing } from '../../types/housing.type.js';
import { Features } from '../../types/features.type.js';
import { Host } from '../../types/host.type.js';

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
    postDate: new Date(postedAt),
    city: city as City,
    imagePreview,
    photos: photos.split(';'),
    isPremium: isPremium as unknown as boolean,
    isFavourite: isFavourite as unknown as boolean,
    rating: Number.parseInt(rating, 10),
    housingType: housingType as Housing,
    roomsNumber: Number.parseInt(bedroomsAmount, 10),
    guestsNumber: Number.parseInt(capacity, 10),
    rentalPrice: Number.parseInt(price, 10),
    conveniences: features.split(';') as unknown as Features,
    author: host as unknown as Host,
    commentsNumber: Number.parseInt(commentsAmount, 10),
    coordinates: location.split(',').map((number) =>
      Number.parseFloat(number)) as unknown as Features
  } as unknown as Offer;
}
