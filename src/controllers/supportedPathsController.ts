import { Express, Request, Response } from 'express';
import listEndpoints, { Endpoint } from 'express-list-endpoints';

const allowedHttpMethods = ["GET", "POST", "PUT", "PATCH"];

export const getSupportedPaths = (app: Express) => (req: Request, res: Response) => {
	const endpoints = listEndpoints(app).reduce((prev: string[], endpoint: Endpoint) => {
		endpoint.methods.filter(it => allowedHttpMethods.includes(it)).forEach(method => {
			prev.push(`${method} ${endpoint.path}`)
		})
		return prev;
	}, [])  
	res.json(endpoints);
}