import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './stores.schema';
import { Model, Types } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import axios from 'axios';
import { PositionDto } from './dtos/position.dto';

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
  async getAll(limit: number, page: number) {
    // Organiza valores de paginação
    if (!limit) {
      limit = 1;
    }

    if (!page) {
      page = 1;
    }
    limit = Math.max(1, limit);
    page = Math.max(1, page);
    const offset = (page - 1) * limit;

    // Retorna o total de documentos no BD
    const total = await this.storeModel.countDocuments();

    // Busca a lista lojas do BD
    const stores = await this.storeModel.find().skip(offset).limit(limit);

    if (!stores) {
      throw new NotFoundException('Could not find stores on the database');
    }

    const response = {
      stores,
      limit,
      page,
      total,
    };

    return response;
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

  async getStoresByPostalCode(postalCode: string) {
    // Tratar cep recebido nos parâmetros
    if (!postalCode) {
      throw new NotFoundException('Postal Code not found!');
    }

    const cleanedPostalCode = postalCode.replace(/\D/g, '');
    if (cleanedPostalCode.length != 8) {
      throw new BadRequestException('Invalid postal code!');
    }

    // Realizar requisição para API ViaCep
    const rPostalCode = await axios.get(
      `http://viacep.com.br/ws/${cleanedPostalCode}/json/`,
    );

    const address = `${rPostalCode.data.logradouro}, ${rPostalCode.data.bairro}`;

    Logger.debug(address);

    // Realizar a requisição para a Geocoding API do Maps
    const geo = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAPS_API_KEY}`,
    );

    if (!geo.data.results.length || geo.data.status !== 'OK') {
      throw new NotFoundException('Could not find geocoding data!');
    }

    const location: PositionDto = geo.data.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;

    Logger.debug(location, latitude, longitude);

    // Realiza a busca de lojas dentro de um raio de 100km
    const stores = await this.storeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: 100000,
          spherical: true,
        },
      },
      {
        $addFields: {
          distanciaEmKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
        },
      },
      {
        $sort: { distance: 1 },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          distance: 0,
        },
      },
    ]);

    Logger.debug(stores);

    return stores;
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
