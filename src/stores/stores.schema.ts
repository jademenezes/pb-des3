import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { storeType } from './enums/store-type.enums';

@Schema()
export class Store {
  @Prop({ required: true })
  storeName: string;

  @Prop({ default: true })
  takeOutInStore: boolean;

  @Prop({ default: 3 })
  shippingTimeInDays: number;

  @Prop({ required: true })
  latitude: string;

  @Prop({ required: true })
  longitude: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({
    type: String,
    enum: Object.values(storeType),
    required: true,
  })
  type: storeType;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop()
  telephoneNumber: string;

  @Prop()
  emailAddress: string;
}

const StoreSchema = SchemaFactory.createForClass(Store);

// Cria um index único para cada combinação de endereço e cep no BD
StoreSchema.index({ address1: 1, postalCode: 1 }, { unique: true });

export { StoreSchema };
