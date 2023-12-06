import { NextFunction, Request, Response } from 'express'
import { join } from 'path'
import { ApiError } from '../commons/errorHandler'

export const getDownloadController =
  (fileName: string, contentType: string) => (req: Request, res: Response, next: NextFunction) => {
    const filePath = join(__dirname, '..', '..', 'files', fileName)
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)
    res.sendFile(filePath, (err) => {
      if (err) {
        return next(new ApiError(500, 'Internal Server Error'))
      }
    })
  }
