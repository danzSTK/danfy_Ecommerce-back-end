import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface UserRequest {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export const UserRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);

export const RequestUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.requestUserId;
  },
);

/* export const ExtractTokenFromHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    return token;
  },
);
 */
