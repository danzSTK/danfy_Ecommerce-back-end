import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantProductDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/variant.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VariantsService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(ProductVariant)
    private readonly variantsRepository: Repository<ProductVariant>,
  ) {}
  async create(productId: string, createVariantDto: CreateVariantProductDto) {
    const product = await this.productService.findOne(productId);

    if (!product) {
      throw new NotFoundException('Não foi possível encontrar o produto');
    }

    const newVariant = this.variantsRepository.create({
      ...createVariantDto,
      product,
    });
    return this.variantsRepository.save(newVariant);
  }

  findAll() {
    return `This action returns all variants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variant`;
  }

  update(id: number, updateVariantDto: UpdateVariantDto) {
    return `This action updates a #${id} variant`;
  }

  remove(id: number) {
    return `This action removes a #${id} variant`;
  }
}
