import { Location } from '../../../types/location.type.js';
import { City } from '../../../types/city.type.js';
import { Housing } from '../../../types/housing.type.js';
import { Features } from '../../../types/features.type.js';
import {
  IsArray,
  IsBoolean,
  IsDateString, IsEnum,
  IsInt, IsMongoId, IsObject, IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 10'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'postedAt must be valid ISO date'})
  public postedAt?: Date;

  @IsOptional()
  @IsEnum(City, {message: 'city must be one of the enum elements'})
  public city?: City;

  @IsOptional()
  @IsString({message: 'imagePreview must be path to image'})
  public imagePreview?: string;

  @IsOptional()
  @IsArray({message: 'photos must be the array'})
  @IsString({each: true, message: 'must be path to photo'})
  public photos?: string[];

  @IsOptional()
  @IsBoolean({message: 'isPremium must be boolean'})
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({message: 'isFavourite must be boolean'})
  public isFavourite?: boolean;

  @IsOptional()
  @Min(1, {message: 'Minimum rating must be 1'})
  @Max(5, {message: 'Maximum rating must be 5'})
  public rating?: number;

  @IsOptional()
  @IsEnum(Housing, {message: 'housingType must be one of the enum elements'})
  public housingType?: Housing;

  @IsOptional()
  @Min(1, {message: 'Minimum bedroomsAmount must be 1'})
  @Max(8, {message: 'Maximum bedroomsAmount must be 8'})
  @IsInt({message: 'bedroomsAmount must be int'})
  public bedroomsAmount?: number;

  @IsOptional()
  @Min(1, {message: 'Minimum capacity must be 1'})
  @Max(10, {message: 'Maximum capacity must be 10'})
  @IsInt({message: 'capacity must be int'})
  public capacity?: number;

  @IsOptional()
  @Min(100, {message: 'Minimum price must be 100'})
  @Max(100000, {message: 'Maximum price must be 100000'})
  public price?: number;

  @IsOptional()
  @IsArray({message: 'features must be array'})
  @IsEnum(Features, {each: true, message: 'features must be one of the enum elements'})
  public features?: Features[];

  @IsOptional()
  @IsMongoId({message: 'host field must be valid an id'})
  public host?: string;

  @IsOptional()
  @IsObject({message: 'location must be a Coordinates object'})
  public location?: Location;
}
