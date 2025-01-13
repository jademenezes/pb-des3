import { CreateStoreDto, UserStoreDto } from '../../dtos/create-store.dto';
import {
  GetStoreResponseDto,
  ListAllResponseDto,
} from '../../dtos/store-response.dto';
import { storeType } from '../../enums/store-type.enums';

export const userStoreStub = (): UserStoreDto => {
  return {
    storeName: 'Loja Teste',
    takeOutInStore: true,
    shippingTimeInDays: 3,
    address: 'Endereço teste',
    type: storeType.PDV,
    postalCode: '00000000',
    telephoneNumber: '00000000000',
    emailAddress: 'email@teste.com.br',
  };
};

export const createStoreStub = (): CreateStoreDto => {
  return {
    storeName: 'Loja Teste',
    takeOutInStore: true,
    shippingTimeInDays: 3,
    latitude: '-11.1111111',
    longitude: '11.1111111',
    location: {
      type: 'Point',
      coordinates: [-11.1111111, 11.1111111],
    },
    address: 'Endereço teste',
    city: 'Porto Alegre',
    state: 'RS',
    type: storeType.PDV,
    country: 'Brasil',
    postalCode: '00000000',
    telephoneNumber: '00000000000',
    emailAddress: 'email@teste.com.br',
  };
};

export const createStoreListStub = (): CreateStoreDto[] => {
  return [
    createStoreStub(),
    {
      storeName: 'Loja Teste 2',
      takeOutInStore: false,
      shippingTimeInDays: 5,
      latitude: '-12.2222222',
      longitude: '12.2222222',
      location: {
        type: 'Point',
        coordinates: [-12.2222222, 12.2222222],
      },
      address: 'Outro Endereço',
      city: 'São Paulo',
      state: 'SP',
      type: storeType.PDV,
      country: 'Brasil',
      postalCode: '11111111',
      telephoneNumber: '11111111111',
      emailAddress: 'email2@teste.com.br',
    },
  ];
};

export const listAllStub = (): ListAllResponseDto => {
  return {
    stores: createStoreListStub(),
    limit: 10,
    page: 1,
    total: 8,
  };
};

export const getStoresResponseStub = (): GetStoreResponseDto => {
  return {
    stores: createStoreStub(),
    limit: 10,
    page: 1,
    total: 8,
  };
};
