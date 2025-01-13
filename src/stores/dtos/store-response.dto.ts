import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { storeType } from '../enums/store-type.enums';
import { DeliveryDto, ShippingDto } from './shipping.dto';

export class ListAllResponseDto {
  @ApiProperty({ type: [CreateStoreDto] })
  stores: CreateStoreDto[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;
}

export class GetStoreResponseDto {
  @ApiProperty()
  stores: CreateStoreDto;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;
}

export class StoreByCepResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  type: storeType;

  @ApiProperty()
  distance: string;

  @ApiProperty({
    oneOf: [
      { type: 'array', items: { $ref: getSchemaPath(DeliveryDto) } },
      { type: 'array', items: { $ref: getSchemaPath(ShippingDto) } },
    ],
  })
  values: DeliveryDto[] | ShippingDto[];
}
