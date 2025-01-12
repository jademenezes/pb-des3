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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserStoreDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  storeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  takeOutInStore?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  shippingTimeInDays?: number;

  @ApiProperty()
  @IsString()
  @MinLength(7)
  @MaxLength(50)
  address: string;

  @ApiProperty()
  @IsString()
  type: storeType;

  @ApiProperty()
  @IsString()
  @Length(8)
  postalCode: string;

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

export class CreateStoreDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  storeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  takeOutInStore?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  shippingTimeInDays?: number;

  @ApiProperty()
  @IsLatitude()
  latitude: string;

  @ApiProperty()
  @IsLongitude()
  longitude: string;

  @ApiProperty()
  @IsNotEmptyObject()
  location: {
    type?: string;
    coordinates: number[];
  };

  @ApiProperty()
  @IsString()
  @MinLength(7)
  @MaxLength(50)
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  type: storeType;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  @Length(8)
  postalCode: string;

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

export class GeoResponseDto {
  latitude: number;

  longitude: number;
}
