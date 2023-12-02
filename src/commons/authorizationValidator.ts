import { Request, Response, NextFunction } from 'express';
import { validateJwtToken } from './jwt';
import { getUserLogin, getUserPassword } from './config';

export const passwordValidator = (req: Request, res: Response, next: NextFunction) => {
    const validators = [validateUserPassword, validateToken];
    let result: ValidationResult = { failed: true };
    for (const validator of validators) {
        result = validator(req, res);
        if (!result.failed) {
            break;
        }
    }
    if (result.failed) {
        res.status(403).send({ error: result?.error })
        return;
    }
    next();
}

type ValidationResult = { 
    failed: boolean, 
    error?: string
};

export type UserData = {
    user: string,
    password: string,
}

export const getUserFromContext = (req: Request): UserData => {
    const user = req.query.username as string || req.headers['x-username'] as string;
    const password = req.query.password as string || req.headers['x-password'] as string;
    return { user, password };
}

const validateUserPassword = (req: Request, res: Response): ValidationResult => {
  const { user, password } = getUserFromContext(req);
  if (!user || !password || !isValidUser(user, password)) {
    return { failed: true, error: 'Unauthorized' };
  }
  return { failed: false };
}

export type TokenData = {
    authType?: string,
    token?: string
}

export const extractTokenFromHeader = (req: Request): TokenData => {
    const authorizationHeader = req.headers['authorization'] || req.headers['x-authorization-token'] as string
    if (!authorizationHeader) {
        return {};
    }
    const [authType, token] = authorizationHeader.split(' ');
    return { authType, token };
}

const validateToken = (req: Request, res: Response): ValidationResult => {
  const { authType, token } = extractTokenFromHeader(req);
  if (!authType || !token) {
    return { failed: true, error: 'Unauthorized' };
  }
  
  if (authType.toLowerCase() === 'bearer') {
    if (!isValidJwtToken(token)) {
        return { failed: true, error: 'Unauthorized' };
    }
  } else if (authType.toLowerCase() === 'basic') {
    if (!isValidBasicAuth(token)) {
        return { failed: true, error: 'Unauthorized' };
    }
  } else {
    return { failed: true, error: 'Unauthorized' };
  }
  return { failed: false };
}

const isValidUser = (user: string, password: string): boolean => {
    return user === getUserLogin() && password === getUserPassword();
}

const isValidJwtToken = (token: string): boolean => {
    return !!validateJwtToken(token);
}

const isValidBasicAuth = (data: string): boolean => {
    const credentials = Buffer.from(data, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    return isValidUser(username, password);
}