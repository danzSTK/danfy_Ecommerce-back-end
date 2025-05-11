import * as bcrypt from 'bcryptjs';
import { HashingServiceProtocol } from './hashing.service';

export class BcryptService extends HashingServiceProtocol {
  hash(password: string): Promise<string> {
    const saltRounds = 10;

    return bcrypt.hash(password, saltRounds);
  }
  compare(value: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(value, passwordHash);
  }
}
