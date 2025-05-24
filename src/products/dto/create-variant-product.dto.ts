import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { Size } from 'src/common/interfaces/enums';

export class CreateVariantProductDto {
  @IsNumber()
  price: number;

  @IsEnum(Size)
  size: Size;

  @IsString()
  color: string;

  /*  @IsArray()
  @IsString({ each: true })
  imageUrl: string[]; */

  @IsInt()
  stock: number;

  @IsBoolean()
  isActive: boolean;
}
