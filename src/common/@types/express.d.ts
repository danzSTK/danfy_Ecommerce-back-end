// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    requestUserId?: number;
  }
}
