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

  async update(
    productId: string,
    id: string,
    updateVariantDto: UpdateVariantDto,
  ) {
    const variant = await this.variantsRepository.findOneBy({
      id,
    });

    if (!variant) {
      throw new NotFoundException('Não foi possível encontrar a variante');
    }

    Object.assign(variant, updateVariantDto);

    return this.variantsRepository.save(variant);
  }

  async remove(id: string) {
    const variant = await this.variantsRepository.findOneBy({
      id,
    });

    if (!variant) {
      throw new NotFoundException('Não foi possível encontrar a variante');
    }

    return this.variantsRepository.remove(variant);
  }
}
