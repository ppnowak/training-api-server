import { Request, Response, NextFunction } from 'express';
import { validateJwtToken } from './jwt';
import { getUserLogin, getUserPassword } from './config';
import { ApiError } from './errorHandler';

export const passwordValidator = (req: Request, res: Response, next: NextFunction) => {
    const validators = [validateUserPassword, validateToken];
    let result: ApiError | undefined = undefined;
    for (const validator of validators) {
        result = validator(req, res);
        if (result === undefined) {
            break;
        }
    }
    if (result) {
        next(result);
        return;
    }
    next();
}

export type UserData = {
    user: string,
    password: string,
}

const createUnauthorizedApiError = () => new ApiError(401, 'Unauthorized');

export const getUserFromContext = (req: Request): UserData => {
    const user = req.query.username as string || req.headers['x-username'] as string;
    const password = req.query.password as string || req.headers['x-password'] as string;
    return { user, password };
}

const validateUserPassword = (req: Request, res: Response): ApiError | undefined => {
  const { user, password } = getUserFromContext(req);
  if (!user || !password || !isValidUser(user, password)) {
    return createUnauthorizedApiError();
  }
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

const validateToken = (req: Request, res: Response): ApiError | undefined => {
  const { authType, token } = extractTokenFromHeader(req);
  if (!authType || !token) {
    return createUnauthorizedApiError();
  }
  
  if (authType.toLowerCase() === 'bearer') {
    if (!isValidJwtToken(token)) {
        return createUnauthorizedApiError();
    }
  } else if (authType.toLowerCase() === 'basic') {
    if (!isValidBasicAuth(token)) {
        return createUnauthorizedApiError();
    }
  } else {
    return createUnauthorizedApiError();
  }
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