import { Request, Response } from 'express'

export const getRedirect = (req: Request, res: Response) => {
  res.redirect(301, '/time')
}
