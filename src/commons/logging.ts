import { NextFunction, Request, Response } from "express";

export const setupLogging = () => (req: Request, res: Response, next: NextFunction) => {
	const postmanToken = req?.headers?.['postman-token'] || '???';
	console.log(`[${new Date().toISOString()}][${postmanToken}] ${req.method} ${req.url}`);
	next();
};