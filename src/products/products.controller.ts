import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductParamsDto } from './dto/find-product-params.dto';
import { Public } from 'src/common/decorators/is-public.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: FindProductParamsDto) {
    return this.productsService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: FindProductParamsDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(params.id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param() params: FindProductParamsDto) {
    return this.productsService.remove(params.id);
  }
}
