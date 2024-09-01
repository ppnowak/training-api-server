import { Request, Response } from 'express'

export const getUptimeController = (req: Request, res: Response) => {
    const uptimeInSeconds = process.uptime();
    const days = Math.floor(uptimeInSeconds / (3600 * 24));
    const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);
    const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    res.json({ uptime, parts: { days, hours, minutes, seconds } });
};