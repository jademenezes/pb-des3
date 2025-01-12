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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStoreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  storeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  takeOutInStore?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  shippingTimeInDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLatitude()
  latitude?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLongitude()
  longitude?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(50)
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: storeType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(8)
  postalCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @Length(11)
  @IsOptional()
  telephoneNumber?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  emailAddress?: string;
}
