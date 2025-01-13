import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from '../stores.controller';
import { StoresService } from '../stores.service';
import {
  createStoreStub,
  getStoresResponseStub,
  listAllStub,
  userStoreStub,
} from './stubs/store.stub';
import { CreateStoreDto } from '../dtos/create-store.dto';
import {
  GetStoreResponseDto,
  ListAllResponseDto,
} from '../dtos/store-response.dto';
import { Types } from 'mongoose';
import { UpdateStoreDto } from '../dtos/update-store.dto';

jest.mock('../stores.service');

describe('StoresController', () => {
  let storesController: StoresController;
  let storesService: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: new (jest.requireMock('../stores.service').StoresService)(),
        },
      ],
    }).compile();

    storesController = module.get<StoresController>(StoresController);
    storesService = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(storesController).toBeDefined();
  });

  // Testes para método createStore
  describe('createStore', () => {
    describe('when createStore is called ', () => {
      let newStore: CreateStoreDto;

      beforeEach(async () => {
        newStore = await storesController.createStore(userStoreStub());
      });

      test('then it should call storesService.createOne', () => {
        expect(storesService.createOne).toHaveBeenCalledWith(userStoreStub());
      });

      test('then it should return a created store', () => {
        expect(newStore).toEqual(createStoreStub());
      });
    });
  });

  // Testa método listAll
  describe('listAll', () => {
    describe('when listAll is called', () => {
      const limit = 1;
      const page = 1;
      let listAllResponse: ListAllResponseDto;

      beforeEach(async () => {
        listAllResponse = await storesService.getAll(limit, page);
      });

      test('then it should call storesService.getAll', () => {
        expect(storesService.getAll).toHaveBeenCalledWith(limit, page);
      });

      test('then it should return a list of stores', () => {
        expect(listAllResponse).toEqual(listAllStub());
      });
    });
  });

  // Testa método getStoreById
  describe('getStoreById', () => {
    describe('when getStoreById is called', () => {
      let store: GetStoreResponseDto;
      const mockId = new Types.ObjectId().toString();

      beforeEach(async () => {
        store = await storesService.getOneById(mockId);
      });

      test('then it should call storesService.getOneById', () => {
        expect(storesService.getOneById).toHaveBeenCalledWith(mockId);
      });

      test('then it should return a store', () => {
        expect(store).toEqual(getStoresResponseStub());
      });
    });
  });

  // Testa método getStoreByState
  describe('getStoreByState', () => {
    describe('when getStoreByState is called', () => {
      let store: ListAllResponseDto;
      const state = 'SP';

      beforeEach(async () => {
        store = await storesService.getStoreByState(state);
      });

      test('then it should call storesService.getOneById', () => {
        expect(storesService.getStoreByState).toHaveBeenCalledWith(state);
      });

      test('then it should return a list of stores', () => {
        expect(store).toEqual(listAllStub());
      });
    });
  });

  // Testa método updateStore
  describe('updateStore', () => {
    describe('when updateStore is called', () => {
      let storeData: UpdateStoreDto;
      let updatedStore: CreateStoreDto;
      const mockId = new Types.ObjectId().toString();

      beforeEach(async () => {
        updatedStore = await storesService.updateOne(mockId, storeData);
      });

      test('then it should call storesService.updateOne', () => {
        expect(storesService.updateOne).toHaveBeenCalledWith(mockId, storeData);
      });

      test('then it should return a store', () => {
        expect(updatedStore).toEqual(createStoreStub());
      });
    });
  });

  // Testa método deleteStore
  describe('deleteStore', () => {
    describe('when deleteStore is called', () => {
      const mockId = new Types.ObjectId().toString();
      let deletedStore: void;

      beforeEach(async () => {
        deletedStore = await storesService.deleteOne(mockId);
      });

      test('then it should call storesService.deleteOne', () => {
        expect(storesService.deleteOne).toHaveBeenCalledWith(mockId);
      });

      test('then it should return nothing', () => {
        expect(deletedStore).toEqual({});
      });
    });
  });
});
