import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { isCloudinaryUrl } from 'src/common/decorators/is-cloudinary-url.decorator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  basePrice: number;

  @IsBoolean()
  isActive: boolean;

  @IsUUID()
  categoryId: string;

  @IsString()
  @IsUrl()
  @isCloudinaryUrl({
    message: 'A imagem precisa ser uma URL válida do Cloudinary.',
  })
  defaultImageUrl: string;

  @IsString()
  imagePublicId: string;
}
