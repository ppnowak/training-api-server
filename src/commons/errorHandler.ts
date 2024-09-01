import { Request, Response, NextFunction } from 'express'
import { getUseErrorHandler } from './config'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public runHttpAuth: boolean = false,
  ) {
    super(message)
  }
}

export const setupErrorHandler = () => (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!getUseErrorHandler()) {
    return next()
  }
  if (err instanceof ApiError) {
    if (err.runHttpAuth) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Access to the secure area"');
    }
    res.status(err.statusCode).json({ status: err.statusCode, error: err.message })
  } else {
    console.log(err)
    res.status(500).json({ status: 500, error: 'Internal Server Error' })
  }
}

export const setupNotFoundErrorHandler = () => (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Not Found'))
}
