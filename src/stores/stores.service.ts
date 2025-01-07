import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './stores.schema';
import { Model } from 'mongoose';

@Injectable()
export class StoresService {
  // Injetar modelo Store
  constructor(@InjectModel(Store.name) private storeModel: Model<Store>) {}
}
