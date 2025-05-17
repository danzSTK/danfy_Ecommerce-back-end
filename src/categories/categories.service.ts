import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    const category = this.categoryRepository.save(newCategory);

    return category;
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: string) {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  /*  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  } */

  async remove(id: string) {
    const category = await this.findOne(id);

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.categoryRepository.delete(id);

    return;
  }

  private async getCategoryById(id: string): Promise<Category | null> {
    const CACHE_KEY = `category:id:${id}`;

    const cachedCategory = await this.cacheManager.get<Category>(CACHE_KEY);

    if (cachedCategory) {
      return cachedCategory;
    }

    const category = await this.categoryRepository.findOneBy({ id });

    if (category) {
      void this.cacheManager.set(CACHE_KEY, category, 1000 * 60);
    }
    return cachedCategory;
  }
}
