import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantProductDto } from './create-variant.dto';

export class UpdateVariantDto extends PartialType(CreateVariantProductDto) {}
