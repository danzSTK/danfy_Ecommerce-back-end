import { forwardRef, Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  controllers: [VariantsController],
  providers: [VariantsService],
})
export class VariantsModule {}
