import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private ModifyFileName(file: Express.Multer.File) {
    const originalName = file.originalname.split('.')[0];
    const date = new Date();
    const timeStamp = date.getTime();
    const newFileName = `${timeStamp}-${originalName}`;

    return newFileName;
  }
  async uploadImage(
    file: Express.Multer.File,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    // Simulate an image upload and return a URL

    return new Promise((resolve, reject) => {
      void cloudinary.uploader
        .upload_stream(
          {
            folder: options?.folder || 'default',
            public_id: this.ModifyFileName(file),
          },
          (error, result) => {
            if (error)
              return reject(
                new BadRequestException('Error uploading image to Cloudinary'),
              );
            if (!result)
              return reject(
                new BadRequestException('No result returned from Cloudinary'),
              );
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async UpdateImage(
    file: Express.Multer.File,
    public_id: string,
    folder: string,
  ): Promise<{ url: string; publicId: string }> {
    // First, destroy the old image
    return cloudinary.uploader
      .destroy(public_id)
      .then((result) => {
        if (!result) {
          throw new BadRequestException(
            'Nenhum resultado retornado ao excluir imagem no Cloudinary',
          );
        }
        // Then, upload the new image
        return this.uploadImage(file, { folder });
      })
      .then((newUploadImage) => {
        return {
          url: newUploadImage.secure_url,
          publicId: newUploadImage.public_id,
        };
      })
      .catch((error) => {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException('Error ao enviar imagem para Cloudinary');
      });
  }
}
