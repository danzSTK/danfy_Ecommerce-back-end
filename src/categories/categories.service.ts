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

  // TODO: Corrigir a logica de criacao da categoria e tirar o decorator Public
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, parentId } = createCategoryDto;

    const newCategory = this.categoryRepository.create({ name });

    if (parentId) {
      const parent = await this.categoryRepository.findOneBy({ id: parentId });

      if (!parent) {
        throw new NotFoundException('Categoria pai não encontrada');
      }
      newCategory.parent = parent;
    }

    return this.categoryRepository.save(newCategory);
  }

  //TODO: remover consoles.log e modificar a busca para incluir produtos
  async findAll() {
    const category = await this.categoryRepository.find({
      where: { parent: undefined },
      relations: ['children'],
    });

    console.log(
      'Categorias parent encontradas:',
      category.map((c) => c.name),
    );
    console.log(
      'Categorias children encontradas:',
      category.map((c) => c.children?.map((child) => child.name)),
    );

    return category;
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
      console.log('Categoria encontrada no cache');
      return cachedCategory;
    }

    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        children: true, // Assuming you want to include products in the category
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category) {
      void this.cacheManager.set(CACHE_KEY, category, 1000 * 60);
    }
    console.log('Categoria encontrada no banco de dados');
    return category;
  }
}
