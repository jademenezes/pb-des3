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

  @IsOptional()
  @IsBoolean()
  takeOutInStore?: boolean;

  @IsOptional()
  @IsNumber()
  shippingTimeInDays?: number;

  // API CALL
  @IsLatitude()
  @IsOptional()
  latitude: string;

  // API CALL
  @IsLongitude()
  @IsOptional()
  longitude: string;

  @IsString()
  @MinLength(7)
  @MaxLength(50)
  address: string;

  // API CALL
  @IsString()
  @IsOptional()
  city: string;

  // API CALL
  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  type: storeType;

  // API CALL
  @IsString()
  @IsOptional()
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
