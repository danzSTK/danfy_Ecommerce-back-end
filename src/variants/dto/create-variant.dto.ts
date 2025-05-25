import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { isCloudinaryUrl } from 'src/common/decorators/is-cloudinary-url.decorator';
import { Size } from 'src/common/interfaces/enums';

export class CreateVariantProductDto {
  @IsNumber()
  price: number;

  @IsEnum(Size)
  size: Size;

  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  @isCloudinaryUrl({
    message: 'A imagem precisa ser uma URL válida do Cloudinary.',
  })
  imageUrl?: string;

  @IsInt()
  stock: number;

  @IsBoolean()
  isActive: boolean;
}
