import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('CACHE_MANAGER')
    private readonly cacheManager: Cache,
  ) {}

  create(createProductDto: CreateProductDto) {
    const newVariantDate = createProductDto.variants;
    const newProduct = this.productRepository.create({
      ...createProductDto,
      variants: newVariantDate,
    });

    const product = this.productRepository.save(newProduct);

    return product;
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.getProductById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.getProductById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }

  private async getProductById(id: string): Promise<Product | null> {
    const cacheKey = `product:id:${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.productRepository.findOneBy({ id });

    if (product) {
      void this.cacheManager.set(cacheKey, product, 1000 * 60 * 60);
    }

    return product;
  }
}
