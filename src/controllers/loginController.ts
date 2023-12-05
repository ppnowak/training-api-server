import { Request, Response } from 'express'
import { getUserFromContext } from '../commons/authorizationValidator'
import { createJwtToken } from '../commons/jwt'

export const doLogin = (req: Request, res: Response) => {
  const { user } = getUserFromContext(req)
  res.json({ token: createJwtToken(user) })
}
