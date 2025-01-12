import {
  IsBoolean,
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { storeType } from '../enums/store-type.enums';

export class UserStoreDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  storeName: string;

  @IsOptional()
  @IsBoolean()
  takeOutInStore?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  shippingTimeInDays?: number;

  @IsString()
  @MinLength(7)
  @MaxLength(50)
  address: string;

  @IsString()
  type: storeType;

  @IsString()
  @Length(8)
  postalCode: string;

  @IsString()
  @Length(11)
  @IsOptional()
  telephoneNumber: string;

  @IsEmail()
  @IsOptional()
  emailAddress: string;
}

export class CreateStoreDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  storeName: string;

  @IsOptional()
  @IsBoolean()
  takeOutInStore?: boolean;

  @IsOptional()
  @IsNumber()
  shippingTimeInDays?: number;

  @IsLatitude()
  latitude: string;

  @IsLongitude()
  longitude: string;

  @IsNotEmptyObject()
  location: {
    type?: string;
    coordinates: number[];
  };

  @IsString()
  @MinLength(7)
  @MaxLength(50)
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  type: storeType;

  @IsString()
  country: string;

  @IsString()
  @Length(8)
  postalCode: string;

  @IsString()
  @Length(11)
  @IsOptional()
  telephoneNumber: string;

  @IsEmail()
  @IsOptional()
  emailAddress: string;
}

export class GeoResponseDto {
  latitude: number;

  longitude: number;
}
