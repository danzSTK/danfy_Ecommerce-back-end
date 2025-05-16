import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateVariantProductDto } from './create-variant-product.dto';

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
  isActive?: boolean;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantProductDto)
  variants: CreateVariantProductDto[];
}
