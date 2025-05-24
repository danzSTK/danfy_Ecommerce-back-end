import { IsString, IsUUID } from 'class-validator';

export class FindProductParamsDto {
  @IsString()
  @IsUUID()
  id: string;
}
