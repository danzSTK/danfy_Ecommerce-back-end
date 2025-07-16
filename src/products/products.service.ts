/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Like, MoreThan, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Category } from 'src/categories/entities/category.entity';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject('CACHE_MANAGER')
    private readonly cacheManager: Cache,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  recusiveCategoryTree(categoriesId: string[]) {
    return this.categoryRepository.query(
      `
      with recursive category_tree as (
        select * from categories c where id = any(array[
          $1
        ]::uuid[])
        union
        select c2.* from categories c2
        inner join category_tree ct on ct."parentId" = c2.id
      )
      select id from category_tree 
      `,
      categoriesId,
    ) as unknown as Promise<Array<{ id: string }>>;
  }

  async create(createProductDto: CreateProductDto) {
    const { categoriesId, ...data } = createProductDto;

    const associatesId = await this.recusiveCategoryTree(categoriesId);
    /* const categories = await this.categoryRepository.find({
      where: { id: In(categoriesId) },
      relations: {
        parent: true,
      },
    }); */

    if (associatesId.length === 0) {
      throw new NotFoundException(
        'Um produto deve ter pelo menos uma categoria valida',
      );
    }

    const newProduct = this.productRepository.create({
      ...data,
      categories: associatesId,
    });

    const product = await this.productRepository.save(newProduct);

    return product;
  }

  async findAll({ categoryId }: { categoryId: string }) {
    const take = 10;
    const page = 1;
    return this.productRepository.find({
      where: {
        ...(categoryId
          ? {
              categories: {
                id: categoryId,
              },
            }
          : []),
      },
      relations: {
        categories: true,
      },
      take: take,
      skip: (page - 1) * take,
      order: {
        createAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.getProductById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  getProductByCategory(categoryId: string) {
    return this.productRepository.find({
      where: {
        categories: {
          id: categoryId,
        },
      },
      relations: ['category', 'category.parent'],
    });
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
