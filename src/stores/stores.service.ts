import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './stores.schema';
import { Model, Types } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

@Injectable()
export class StoresService {
  // Injetar modelo Store
  constructor(@InjectModel(Store.name) private storeModel: Model<Store>) {}

  // Método para criar uma loja no BD
  async createOne(createStoreDto: CreateStoreDto) {
    // console.log('Service DTO:', createStoreDto);
    const newStore = new this.storeModel(createStoreDto);
    // console.log(newStore);

    if (!newStore) {
      throw new BadRequestException('Could not create store on the database');
    }

    return await newStore.save();
  }

  // Retorna uma lista com todas as lojas no BD
  async getAll() {
    const storeList = await this.storeModel.find();

    if (!storeList) {
      throw new NotFoundException('Could not find stores on the database');
    }

    return storeList;
  }

  // Retorna uma loja com determinada ID
  async getOneById(id: string) {
    // Verifica se o parâmetro ID enviado é em um formato válido para MongoDB
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format!');
    }
    const store = await this.storeModel.findById(id);

    if (!store) {
      throw new NotFoundException('Could not find a store with this ID!');
    }

    return store;
  }

  // Atualiza as informações de uma loja com determinada ID baseado nos valores que são recebidos do body
  async updateOne(id: string, body: UpdateStoreDto) {
    const updatedStore = await this.storeModel.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      { new: true, runValidators: true },
    );

    if (!updatedStore) {
      throw new NotFoundException('Could not find a store with this ID!');
    }

    return updatedStore;
  }

  // Método para deletar uma loja do BD
  async deleteOne(id: string) {
    return await this.storeModel.findByIdAndDelete(id);
  }
}
