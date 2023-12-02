import rateLimit from "express-rate-limit";

export type ThrottlingOptions = {
    maxRequests: number, 
    timeRangeSeconds: number
}

export const setupThrottling = (options: ThrottlingOptions) => rateLimit({
    windowMs: options.timeRangeSeconds * 1000,
    max: options.maxRequests,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
});