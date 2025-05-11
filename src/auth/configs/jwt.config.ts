import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    secretRefresh: process.env.JWT_REFRESH_SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    expiresIn: Number(process.env.JWT_TTL) || 86400, // 24 hours
    expiresInRefresh: Number(process.env.JWT_TTL_REFRESH) || 604800, // 7 days
  };
});
