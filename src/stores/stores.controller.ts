import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  // Define a rota para a criação de uma loja
  @Post()
  createStore(@Body() body: CreateStoreDto) {
    return this.storesService.createOne(body);
  }

  // Define a rota para listar todas as lojas no BD
  @Get()
  listAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.storesService.getAll(limit, page);
  }

  // Define a rota para buscar as lojas em um raio de 100KM de um determinado CEP
  storesByCep() {}

  // Define a rota que lista 1 loja com determinado ID
  @Get(':id')
  getStore(@Param('id') id: string) {
    return this.storesService.getOneById(id);
  }

  // Define a rota que atualiza as informações de uma loja
  @Patch(':id')
  updateStore(@Param('id') id: string, @Body() body: UpdateStoreDto) {
    return this.storesService.updateOne(id, body);
  }

  // Define a rota que deleta uma loja do BD
  @Delete(':id')
  deleteStore(@Param('id') id: string) {
    return this.storesService.deleteOne(id);
  }
}
