import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './stores.schema';
import { Model, Types } from 'mongoose';
import { CreateStoreDto, UserStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import axios from 'axios';
import { PositionDto } from './dtos/position.dto';
import { StoreOutput } from './dtos/store-output.interface';

@Injectable()
export class StoresService {
  constructor(@InjectModel(Store.name) private storeModel: Model<Store>) {}

  // Método que limpa o cep enviado pelo usuário
  private cleanPostalCode(postalCode: string) {
    const cleanedPostalCode = postalCode.replace(/\D/g, '');
    if (cleanedPostalCode.length != 8) {
      throw new BadRequestException('Invalid postal code!');
    }

    return cleanedPostalCode;
  }

  // Método que extrai as informações do endereço com a API ViaCep
  private async getAddressInfo(postalCode: string, userAddress: string) {
    const viaCepResponse = await axios.get(
      `http://viacep.com.br/ws/${postalCode}/json/`,
    );

    const { logradouro } = viaCepResponse.data;

    // Verificar se o endereço enviado é igual ao logradouro
    const lastIndex = userAddress.lastIndexOf(' ');

    if (lastIndex === -1) {
      throw new BadRequestException('Please write a street number!');
    }

    const streetAddress = userAddress.slice(0, lastIndex);

    if (streetAddress != logradouro) {
      throw new BadRequestException('Please write the full address!');
    }

    const addressInfo = {
      district: viaCepResponse.data.bairro,
      city: viaCepResponse.data.localidade,
      state: viaCepResponse.data.uf,
    };

    return addressInfo;
  }

  // Método para calcular preço de entrega dinamicamente
  private async calculatePricing(
    originPostalCode: string,
    destinationPostalCode: string,
    distanceKM: number,
    type: string,
  ) {
    if (type === 'PDV' || (type === 'Loja' && distanceKM < 50)) {
      return [
        {
          prazo: '1 dia útil',
          price: 'R$ 15,00',
          description: 'delivery',
        },
      ];
    }

    if (type === 'Loja' && distanceKM >= 50) {
      const responseShipping = await axios.post(
        'https://www.correios.com.br/@@precosEPrazosView',
        {
          cepDestino: originPostalCode,
          cepOrigem: destinationPostalCode,
          comprimento: '20',
          largura: '15',
          altura: '10',
        },
      );
      const sedex = responseShipping.data[0];
      const pac = responseShipping.data[1];

      return [
        {
          prazo: `${sedex.prazo.split(' ', 1)} dias úteis`,
          codProdutoAgencia: sedex.codProdutoAgencia,
          price: sedex.precoAgencia,
          description: sedex.urlTitulo,
        },
        {
          prazo: `${pac.prazo.split(' ', 1)} dias úteis`,
          codProdutoAgencia: pac.codProdutoAgencia,
          price: pac.precoAgencia,
          description: pac.urlTitulo,
        },
      ];
    }
  }

  // Método para criar uma loja no BD
  async createOne(userStoreData: UserStoreDto) {
    // Tratar o cep recebido
    const { postalCode, address } = userStoreData;
    const cleanedPostalCode = this.cleanPostalCode(postalCode);

    // Extrair informaçôes do endereço
    const addressInfo = await this.getAddressInfo(cleanedPostalCode, address);
    const fullAddress = `${address}, ${addressInfo.district}, ${addressInfo.state}`;
    const language = 'pt-BR';

    // Requisição para Maps Geocoding API para extrair os dados restantes
    const geoResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=${process.env.MAPS_API_KEY}&language=${language}`,
    );

    const location = {
      latitude: geoResponse.data.results[0].geometry.location.lat,
      longitude: geoResponse.data.results[0].geometry.location.lng,
    };

    // Definição de dto de criação de loja
    const newStoreData: CreateStoreDto = {
      ...userStoreData,
      postalCode: cleanedPostalCode,
      latitude: location.latitude,
      longitude: location.longitude,
      location: { coordinates: [location.longitude, location.latitude] },
      state: addressInfo.state,
      city: addressInfo.city,
      country: geoResponse.data.results[0].address_components[5].long_name,
    };

    // Criação da loja no BD
    const newStore = new this.storeModel(newStoreData);

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

  // Retorna uma lista de lojas ordenadas por distância do cep recebido
  async getStoresByPostalCode(postalCode: string, radius?: number) {
    // Tratar cep recebido nos parâmetros
    if (!postalCode) {
      throw new NotFoundException('Postal Code not found!');
    }

    const cleanedPostalCode = this.cleanPostalCode(postalCode);

    // Realizar requisição para API ViaCep
    const rPostalCode = await axios.get(
      `http://viacep.com.br/ws/${cleanedPostalCode}/json/`,
    );

    const address = `${rPostalCode.data.logradouro}, ${rPostalCode.data.bairro}`;

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

    // Realiza a busca de lojas dentro de um raio
    if (!radius) {
      radius = 100;
    }

    const stores = await this.storeModel.aggregate<StoreOutput>([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: radius * 1000,
          spherical: true,
        },
      },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 1] },
        },
      },
      {
        $sort: { distance: 1 },
      },
      {
        $project: {
          name: '$storeName',
          city: 1,
          postalCode: 1,
          type: 1,
          distance: {
            $concat: [{ $toString: '$distanceKm' }, ' km'],
          },
        },
      },
    ]);

    // Remove PDVs acima de 50km e calcula o preço de entrega das lojas restantes
    const filteredStores = await Promise.all(
      stores
        .flatMap(async (store) => {
          const distanceValue = parseFloat(store.distance.replace(' km', ''));

          if (store.type === 'PDV' && distanceValue > 50.0) {
            return null;
          }

          const shippingValues = await this.calculatePricing(
            store.postalCode,
            cleanedPostalCode,
            distanceValue,
            store.type,
          );

          // Formata o objeto de resposta
          return {
            name: store.name,
            city: store.city,
            postalCode: store.postalCode,
            type: store.type,
            distance: store.distance,
            values: shippingValues,
          };
        })
        .filter((store) => store !== null),
    );

    // Filtra apenas as lojas válidas
    const validStores = filteredStores.filter((store) => store !== null);

    return {
      stores: validStores,
    };
  }

  // Método que retorna uma lista de todas as lojas em um estado
  async getStoreByState(state: string) {
    const stores = await this.storeModel.find({ state });

    if (!stores) {
      throw new NotFoundException('Not able to find any stores in this state!');
    }

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
    await this.storeModel.findByIdAndDelete(id);
  }
}
