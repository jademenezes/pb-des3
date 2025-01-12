import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto, UserStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  GetStoreResponseDto,
  ListAllResponseDto,
  StoreByCepResponseDto,
} from './dtos/store-response.dto';
import { ErrorResponseDto } from './dtos/error-response.dto';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  // Define a rota para a criação de uma loja
  @ApiOperation({ summary: 'Permite criar uma loja' })
  @ApiCreatedResponse({ type: CreateStoreDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Post()
  createStore(@Body() body: UserStoreDto) {
    return this.storesService.createOne(body);
  }

  // Define a rota para listar todas as lojas no BD
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiOkResponse({ type: ListAllResponseDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiOperation({ summary: 'Busca todas as lojas' })
  @Get()
  listAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.storesService.getAll(limit, page);
  }

  // Define a rota que lista 1 loja com determinado ID
  @ApiOperation({ summary: 'Busca uma loja com o ID recebido' })
  @ApiOkResponse({ type: GetStoreResponseDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Get(':id')
  getStoreById(@Param('id') id: string) {
    return this.storesService.getOneById(id);
  }

  // Define a rota para buscar as lojas em um raio de 100KM de um determinado CEP
  @ApiQuery({ name: 'radius', required: false })
  @ApiOkResponse({ type: StoreByCepResponseDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiOperation({ summary: 'Busca uma lista de lojas ordenadas por distância' })
  @Get(':postalCode')
  storesByCep(
    @Param('postalCode') postalCode: string,
    @Query('radius') radius: number,
  ) {
    return this.storesService.getStoresByPostalCode(postalCode, radius);
  }

  // Define a rota que retorna uma lista de todas as lojas de um determinado estado
  @ApiOperation({ summary: 'Busca uma lista de lojas em um estado' })
  @ApiOkResponse({ type: ListAllResponseDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('/state/:state')
  getStoresByState(@Param('state') state: string) {
    return this.storesService.getStoreByState(state);
  }

  // Define a rota que atualiza as informações de uma loja
  @ApiOperation({ summary: 'Atualiza informações de uma loja' })
  @ApiOkResponse({ type: GetStoreResponseDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Patch(':id')
  updateStore(@Param('id') id: string, @Body() body: UpdateStoreDto) {
    return this.storesService.updateOne(id, body);
  }

  // Define a rota que deleta uma loja do BD
  @ApiOperation({ summary: 'Delete uma loja' })
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(204)
  deleteStore(@Param('id') id: string) {
    return this.storesService.deleteOne(id);
  }
}
