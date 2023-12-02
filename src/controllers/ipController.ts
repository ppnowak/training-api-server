import { Request, Response } from 'express';

export const getIp = (req: Request, res: Response): void => {
  const serverIp = req.socket.localAddress;
  const clientIp = req.ip;
  res.json({ serverIp, clientIp });
};
