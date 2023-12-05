import { NextFunction, Request, Response } from 'express'
import { extractTokenFromHeader } from '../commons/authorizationValidator'
import { validateJwtToken } from '../commons/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { ApiError } from '../commons/errorHandler'

export const getTokenInfo = (req: Request, res: Response, next: NextFunction) => {
  const { token = '' } = extractTokenFromHeader(req)
  const tokenInfo = validateJwtToken(token)
  if (!tokenInfo) {
    next(new ApiError(400, 'Could not decode token!'))
    return
  }
  res.json({ token, ...(tokenInfo as JwtPayload) })
}
