import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, MoreThan, Repository } from 'typeorm';
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

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    let defaultImageUrl = '';

    if (file) {
      const { secure_url } = await this.cloudinaryService.uploadImage(file, {
        folder: 'products',
      });
      defaultImageUrl = secure_url;
    }
    const { categoryId, ...data } = createProductDto;
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const newProduct = this.productRepository.create({
      ...data,
      defaultImageUrl,
      category,
    });
    const product = this.productRepository.save(newProduct);

    return product;
  }

  findAll() {
    const take = 10;
    const page = 1;
    return this.productRepository.find({
      where: {
        variants: {
          price: MoreThan(30),
        },
      },
      relations: {
        category: true,
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
