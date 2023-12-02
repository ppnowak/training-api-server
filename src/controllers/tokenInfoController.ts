import { Request, Response } from "express";
import { extractTokenFromHeader } from "../commons/authorizationValidator";
import { validateJwtToken } from "../commons/jwt";
import { JwtPayload } from "jsonwebtoken";

export const getTokenInfo = (req: Request, res: Response) => {
    const { token = '' } = extractTokenFromHeader(req);
    const tokenInfo = validateJwtToken(token);
    if (!tokenInfo) {
        res.json({ error: "Could not decode token!"});
        return;
    }
    res.json({ token, ...(tokenInfo as JwtPayload)});
};