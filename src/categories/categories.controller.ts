import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { FindCategoryParamsDto } from './dto/find-category-params.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //TODO: Retirar decorator public após testes
  @Public()
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param() params: FindCategoryParamsDto) {
    return this.categoriesService.findOne(params.id);
  }

  /* @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  } */

  @Delete(':id')
  remove(@Param('id') params: FindCategoryParamsDto) {
    return this.categoriesService.remove(params.id);
  }
}
