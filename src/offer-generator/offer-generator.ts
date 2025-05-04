import dayjs from 'dayjs';

import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { MockData } from '../shared/types/mock-data.type.js';
import { getRandomItem } from '../shared/helpers/random.js';
import { generateRandomValue } from '../shared/helpers/random.js';
import { City } from '../shared/types/city.type.js';
import { Housing } from '../shared/types/housing.type.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {
  }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY,LAST_WEEK_DAY),'day').toISOString();
    const city = getRandomItem([City.Paris, City.Cologne, City.Brussels, City.Amsterdam,
      City.Hamburg, City.Dusseldorf]);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreviews);
    const photos = getRandomItem<string>(this.mockData.images);
    const isPremium = getRandomItem([true, false]);
    const isFavourite = getRandomItem([true, false]);
    const rating = generateRandomValue(1,5);
    const housingType = getRandomItem([Housing.Apartment, Housing.House,
      Housing.Room, Housing.Hotel]);
    const roomsNumber = generateRandomValue(1,5);
    const guestsNumber = generateRandomValue(1,10);
    const rentalPrice = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const conveniences = getRandomItem<string>(this.mockData.conveniences);
    const author = getRandomItem<string>(this.mockData.authors);
    const commentsNumber = getRandomItem<string>(this.mockData.commentsNumbers);
    const coordinates = getRandomItem<string>(this.mockData.coordinates);

    return [
      name, description, postDate,
      city, imagePreview, photos, isPremium,
      isFavourite, rating, housingType, roomsNumber,
      guestsNumber, rentalPrice, conveniences,
      author, commentsNumber, coordinates
    ].join('\t');
  }
}
