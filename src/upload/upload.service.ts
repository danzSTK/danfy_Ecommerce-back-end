import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  async uploadImage(file: Express.Multer.File, options?: { folder: string }) {
    const result = await this.cloudinaryService.uploadImage(file, options);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  /*   findOne(public_id: number) {
    return;
  } */

  async updateImage(public_id: string, file: Express.Multer.File) {
    return this.cloudinaryService.UpdateImage(file, public_id, 'products');
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
