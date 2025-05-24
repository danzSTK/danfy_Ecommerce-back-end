import { IsString, IsUUID } from 'class-validator';

export class FindCategoryParamsDto {
  @IsString()
  @IsUUID()
  id: string;
}
