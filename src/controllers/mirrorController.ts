import { Request, Response } from 'express'

export const mirrorRequest = (req: Request, res: Response): void => {
  const { method, url, headers } = req;

  let payload;
  if (req.is('multipart/form-data')) {
    const files = (req.files as Express.Multer.File[])?.map((file: Express.Multer.File) => {
      return {
        ...file,
        buffer: undefined
      };
    });

    payload = {
      fields: req.body,
      files
    };
  } else {
    payload = req.body;
  }

  const responseData = {
    method,
    url,
    headers: { ...headers },
    queryParams: req.query,
    payload,
  };

  res.json(responseData);
};