import { readFileSync } from 'node:fs';

import { FileReaderInterface } from './file-reader.interface.js';
import { Offer } from '../types/offer.type.js';
import { City } from '../types/city.type.js';
import { Housing } from '../types/housing.type.js';
import { Features } from '../types/features.type.js';
import { OfferPhotos } from '../types/offerPhotos.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] | [] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          postedAt,
          city,
          preview,
          allPhotos,
          isPremium,
          rating,
          housingType,
          bedroomsAmount,
          capacity,
          price,
          features,
          host,
          commentsAmount,
          location,
        ]) => {
          const [name, email, userpic, password, hostIsPro] = host.split(',');
          const [lat, lng] = location.split(',');

          return {
            title,
            description,
            postedAt: new Date(+postedAt),
            city: city as City,
            photos: {
              preview,
              all: allPhotos.split(',') as OfferPhotos,
            },
            isPremium: isPremium === 'true',
            rating: +rating,
            housingType: housingType as Housing,
            bedroomsAmount: +bedroomsAmount,
            capacity: +capacity,
            price: +price,
            features: features.split(',') as Features[],
            host: {
              name,
              email,
              userpic,
              password,
              isPro: hostIsPro === 'true',
            },
            commentsAmount: +commentsAmount,
            location: {lat: +lat, lng: +lng}
          };
        }
      );
  }
}
