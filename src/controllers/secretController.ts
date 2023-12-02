import { Request, Response } from "express";

export const getSecret = (req: Request, res: Response) => {
    res.json({ secretData: 'This is the secret data!' });
};