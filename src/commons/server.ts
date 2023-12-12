import { Express } from "express";
import * as https from "https";
import { getAppPort, getCertificateType, getPrivateKeyPath, isHttpsEnabled } from "./config";
import { readFileSync } from "fs";

export const getServer = (app: Express) : Express | https.Server => {
    if (isHttpsEnabled()) {
        const privateKey = readFileSync(getPrivateKeyPath(), 'utf8');
        const certificate = readFileSync(getCertificateType(), 'utf8');
        const credentials = { key: privateKey, cert: certificate };
        return https.createServer(credentials, app);
    }
    return app;
}

export const startServer = (app: Express) => {
    getServer(app).listen(getAppPort(), () => {
        console.log(`Server is listening on port ${getAppPort()}`)
    });
}