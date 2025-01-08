import {
  IsBoolean,
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { storeType } from '../enums/store-type.enums';

export class CreateStoreDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  storeName: string;

  @IsBoolean()
  takeOutInStore: boolean;

  @IsNumber()
  shippingTimeInDays: number;

  @IsLatitude()
  latitude: string;

  @IsLongitude()
  longitude: string;

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
