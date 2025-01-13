import { createStoreStub } from '../test/stubs/store.stub';

export const storeModel = {
  create: jest.fn().mockReturnValue(createStoreStub()),
  find: jest.fn().mockReturnValue([createStoreStub()]),
  findOne: jest.fn().mockReturnValue(createStoreStub()),
  updateOne: jest.fn().mockReturnValue({ nModified: 1 }),
  deleteOne: jest.fn().mockReturnValue({ deletedCount: 1 }),
};
