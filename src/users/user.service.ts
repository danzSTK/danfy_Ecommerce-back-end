import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from 'src/auth/hashing/hashing.service';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
    @Inject('CACHE_MANAGER')
    private readonly cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const newUserDate = {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
        createAt: new Date(),
      };

      const newUser = this.userRepository.create(newUserDate);
      const user = await this.userRepository.save(newUser);

      return user;
    } catch (error: any) {
      if (error instanceof QueryFailedError) {
        if (error['code'] == '23505') {
          throw new ConflictException('Email já cadastrado');
        }
      }

      throw new InternalServerErrorException('ai é foda');
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number, sub: number) {
    if (id !== sub) {
      console.log(sub);
      throw new UnauthorizedException('Você não pode acessar esse usuário');
    }

    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException('Não foi possível encontrar o usuário');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, sub: number) {
    if (id !== sub) {
      console.log(sub);
      throw new UnauthorizedException('Você não pode acessar esse usuário');
    }

    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto?.password) {
      updateUserDto.password = await this.hashingService.hash(
        updateUserDto.password,
      );
    }

    const userUpdated = {
      name: updateUserDto.name,
      passwordHash: updateUserDto.password,
    };

    await this.userRepository.update(id, userUpdated);

    return { message: 'Usuário atualizado com sucesso!' };
  }

  // TODO: Adicionar campo de status para o usuário pois o usuario não pode ser deletado e sim desativado fazendo um soft delete
  // TODO: Melhorar verificação de usuário pois somente o proprio usuario ou um admin pode deletar o usuário
  async remove(id: number, sub: number) {
    if (id !== sub) {
      console.log(sub);
      throw new UnauthorizedException('Você não pode acessar esse usuário');
    }

    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.userRepository.delete(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    console.time('cache');
    const cacheKey = `user:email:${email}`;
    const cacheUser = await this.cacheManager.get<User>(cacheKey);
    console.timeEnd('cache');

    if (cacheUser) {
      console.log('Estou em cache');
      return cacheUser;
    }

    // Se não estiver no cache, busque no banco de dados
    // e armazene no cache
    // o resultado por 1 hora
    console.time('db');
    const user = await this.userRepository.findOneBy({ email });
    console.timeEnd('db');

    if (user) {
      void this.cacheManager.set(cacheKey, user, 1000 * 60 * 60);
    }

    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const cacheKey = `user:id:${id}`;
    const cacheUser = await this.cacheManager.get<User>(cacheKey);

    if (cacheUser) {
      console.log('Estou em cache');
      return cacheUser;
    }

    const user = await this.userRepository.findOneBy({ id });

    if (user) {
      void this.cacheManager.set(cacheKey, user, 1000 * 60 * 60);
    }

    return user;
  }
}
