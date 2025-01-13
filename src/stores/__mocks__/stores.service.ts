import {
  createStoreStub,
  getStoresResponseStub,
  listAllStub,
} from '../test/stubs/store.stub';

export const StoresService = jest.fn().mockReturnValue({
  createOne: jest.fn().mockReturnValue(createStoreStub()),
  getAll: jest.fn().mockReturnValue(listAllStub()),
  getOneById: jest.fn().mockReturnValue(getStoresResponseStub()),
  getStoresByPostalCode: jest.fn().mockReturnValue({}),
  getStoreByState: jest.fn().mockReturnValue(listAllStub()),
  updateOne: jest.fn().mockReturnValue(createStoreStub()),
  deleteOne: jest.fn().mockReturnValue({}),
});
