import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callBack) => {
        if (!file) {
          return callBack(
            new BadRequestException('Imagem não encontrada'),
            false,
          );
        }

        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callBack(
            new BadRequestException(
              'Apenas imagem com formato permitido: .png, .jpeg ou jpg',
            ),
            false,
          );
        }

        callBack(null, true);
      },
    }),
  )
  create(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Imagem não encontrada ou inválida');
    }
    return this.uploadService.uploadImage(file, {
      folder: 'products',
    });
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  /*   @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  } */

  @Patch('')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (req, file, callBack) => {
        if (!file) {
          return callBack(
            new BadRequestException('Imagem não encontrada'),
            false,
          );
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callBack(
            new BadRequestException(
              'Apenas imagem com formato permitido: .png, .jpeg ou jpg',
            ),
            false,
          );
        }
        callBack(null, true);
      },
    }),
  )
  update(
    @Body('public_id') public_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.updateImage(public_id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
