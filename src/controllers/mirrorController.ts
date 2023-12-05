import { Request, Response } from 'express'

export const mirrorRequest = (req: Request, res: Response): void => {
  const { method, url, headers, body } = req

  const responseData = {
    method,
    url,
    headers: { ...headers },
    payload: body,
  }

  res.json(responseData)
}
