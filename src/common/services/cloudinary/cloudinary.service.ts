import { Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    // Simulate an image upload and return a URL
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options ?? {}, (error, result) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (error) return reject(error);
          if (!result)
            return reject(new Error('No result returned from Cloudinary'));
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
