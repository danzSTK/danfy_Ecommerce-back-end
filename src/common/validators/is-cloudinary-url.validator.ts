/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCloudinaryUrl', async: false })
export class IsCloudinaryUrlConstraint implements ValidatorConstraintInterface {
  validate(
    value: string,
    _args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    try {
      const url = new URL(value);
      const validHosts = ['res.cloudinary.com', 'cloudinary.com'];

      if (!validHosts.includes(url.hostname)) return false;

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

      if (!url.pathname.startsWith(`/${cloudName}/`)) return false;

      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(_args?: ValidationArguments) {
    return 'URL inválida. A URL deve ser uma URL válida do Cloudinary.';
  }
}
