import { Request, Response, NextFunction } from 'express'

export const fixEncoding = (req: Request, res: Response, next: NextFunction) => {
    const sourceCharset = 'charset=ISO-8859-1';
    const targetCharset = 'charset=UTF-8';
    if (req.headers['content-type']?.includes(sourceCharset)) {
        req.headers['content-type'] = req.headers['content-type'].replace(sourceCharset, targetCharset);
    }
    return next();
}