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

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  storeName?: string;

  @IsOptional()
  @IsBoolean()
  takeOutInStore?: boolean;

  @IsOptional()
  @IsNumber()
  shippingTimeInDays?: number;

  @IsOptional()
  @IsLatitude()
  latitude?: string;

  @IsOptional()
  @IsLongitude()
  longitude?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(50)
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  type?: storeType;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  @Length(8)
  postalCode?: string;

  @IsString()
  @Length(11)
  @IsOptional()
  telephoneNumber?: string;

  @IsEmail()
  @IsOptional()
  emailAddress?: string;
}
