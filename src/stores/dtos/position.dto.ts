import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class PositionDto {
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;
}
