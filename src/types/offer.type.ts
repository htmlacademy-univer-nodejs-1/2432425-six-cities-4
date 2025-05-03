import { City } from './city.type.js';
import { Features } from './features.type.js';
import { Host } from './host.type.js';
import { Housing } from './housing.type.js';
import { Location } from './location.type.js';

export type Offer = {
  title: string; // length === 10 — 100
  description: string; // length === 20 — 1024
  postedAt: Date;
  city: City;
  imagePreview: string;
  photos: string[];
  isPremium: boolean;
  isFavourite: boolean;
  rating: number; // 1.0 — 5.0
  housingType: Housing;
  bedroomsAmount: number; // 1 — 8
  capacity: number; // 1 — 10
  price: number; // 100 — 100_000
  features: Features[];
  host: Host;
  commentsAmount: number;
  location: Location;
};
