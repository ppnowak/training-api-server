import { Request, Response } from 'express';

export const getTime = (req: Request, res: Response): void => {
  const currentTime = new Date().toISOString();
  res.json({ time: currentTime });
};
