import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductParamsDto } from './dto/find-product-params.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callBack) => {
        if (!file) {
          return callBack(
            new BadRequestException('Imagem não encontrada'),
            false,
          );
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callBack(
            new BadRequestException(
              'Apenas imagem com formato permitido: .png, .jpeg ou jpg',
            ),
            false,
          );
        }
        callBack(null, true);
      },
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
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
