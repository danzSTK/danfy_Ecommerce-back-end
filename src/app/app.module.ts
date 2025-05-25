import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/users/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsModule } from 'src/products/products.module';
import { CloudinaryModule } from 'src/common/services/cloudinary/cloudinary.module';
import { UploadModule } from 'src/upload/upload.module';
import { VariantsModule } from 'src/variants/variants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 60, // seconds
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    CategoriesModule,
    ProductsModule,
    VariantsModule,
    CloudinaryModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
