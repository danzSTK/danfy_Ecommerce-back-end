import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsCloudinaryUrlConstraint } from '../validators/is-cloudinary-url.validator';

export function isCloudinaryUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCloudinaryUrlConstraint,
    });
  };
}
