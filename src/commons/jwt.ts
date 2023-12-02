import * as jwt from 'jsonwebtoken';
import { getJwtSecret } from './config';

const secretKey = getJwtSecret();

export const createJwtToken = (username: string): string => {
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1m' }); 
  return token;
}

export const validateJwtToken = (token: string): boolean | string | jwt.JwtPayload => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return false;
  }
}
