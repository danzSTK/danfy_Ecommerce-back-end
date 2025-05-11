import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hashing/hashing.service';
import jwtConfig from './configs/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    @Inject('CACHE_MANAGER')
    private readonly cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.getUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordMatch = await this.hashingService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return this.genereteTokens(user);
  }

  async refreshToken(refreshToken: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<TokenPayloadDto>(
        refreshToken.refreshToken,
      );

      const user = await this.userRepository.findOneBy({
        id: sub,
      });

      if (!user) {
        throw new Error('Pessoa não encontrada');
      }

      return this.genereteTokens(user);
    } catch (error) {
      // TODO: DEPOIS EU CORRIJO ESSA BOSTA
      console.log(error);
      throw new UnauthorizedException('Sei lá');
    }
  }

  private async singJwtAsync<T>(
    sub: number,
    expiresIn: number,
    secret: string | undefined,
    payload?: T,
  ) {
    if (!secret) {
      // TODO: Corrigir texto
      throw new Error(
        'A secret não está sendo informada, verificar variaveis de ambiente',
      );
    }

    const acessToken = await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret,
        expiresIn,
      },
    );

    return acessToken;
  }

  private async genereteTokens(user: User) {
    const acessToken = await this.singJwtAsync<Partial<User>>(
      user.id,
      this.jwtConfiguration.expiresIn,
      this.jwtConfiguration.secret,
      {
        email: user.email,
      },
    );

    const refreshToken = await this.singJwtAsync(
      user.id,
      this.jwtConfiguration.expiresInRefresh,
      this.jwtConfiguration.secretRefresh,
    );

    return {
      acessToken,
      refreshToken,
    };
  }

  async getUserByEmail(email: string) {
    console.time('cache');
    const cacheUser = await this.cacheManager.get<User>(`user:${email}`);
    console.timeEnd('cache');

    if (cacheUser) {
      console.log('Estou em cache');
      return cacheUser;
    }
    console.time('db');
    const user = await this.userRepository.findOneBy({ email });

    console.timeEnd('db');
    if (user) {
      void this.cacheManager.set(`user:${email}`, user, 1000 * 60 * 60);
    }

    return user;
  }
}
