import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  // Define a rota para listar todas as rotas no BD
  @Get()
  getAllStores() {
    return this.storesService.getAll();
  }

  // Retorna uma loja que tenha um determinado ID
  @Get(':id')
  getStore(@Param('id') id: string) {
    return this.storesService.getOneById(id);
  }

  // Atualiza as informações de uma loja no BD
  @Patch(':id')
  updateStore(@Param('id') id: string, @Body() body: UpdateStoreDto) {
    return this.storesService.updateOne(id, body);
  }

  // Deleta uma loja do BD
  @Delete(':id')
  deleteStore(@Param('id') id: string) {
    return this.storesService.deleteOne(id);
  }
}
