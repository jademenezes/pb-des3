import { ApiProperty } from '@nestjs/swagger';

export class DeliveryDto {
  @ApiProperty()
  prazo: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  description: string;
}

export class ShippingDto {
  @ApiProperty()
  prazo: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  codProdutoAgencia: string;

  @ApiProperty()
  decription: string;
}
