import express from 'express'
import { getTime } from './controllers/timeController'
import { getIp } from './controllers/ipController'
import { mirrorRequest } from './controllers/mirrorController'
import { setupThrottling } from './commons/throttling'
import { setupLogging } from './commons/logging'
import { getSupportedPaths } from './controllers/supportedPathsController'
import { Paths } from './commons/paths'
import { passwordValidator } from './commons/authorizationValidator'
import { getSecret } from './controllers/secretController'
import { doLogin } from './controllers/loginController'
import { getTokenInfo } from './controllers/tokenInfoController'
import { setupErrorHandler, setupNotFoundErrorHandler } from './commons/errorHandler'
import { getRedirect } from './controllers/redirectController'
import userRouter from './controllers/userController'
import {  startServer } from './commons/server'
import { join } from 'path';
import serveIndex from 'serve-index';

const app = express()

// Setup express
app.use(setupThrottling({ maxRequests: 60, timeRangeSeconds: 30 }))
app.use(express.json())
app.use(Paths.MIRROR, express.text())
app.use(setupLogging())

// // Setup paths
app.get(Paths.TIME, getTime)
app.get(Paths.IP, getIp)
app.all(Paths.MIRROR, mirrorRequest)
app.get(Paths.INFO, getSupportedPaths(app))
app.post(Paths.LOGIN, passwordValidator, doLogin)
app.get(Paths.SECRET, passwordValidator, getSecret)
app.get(Paths.CHECK_TOKEN, getTokenInfo)
app.get(Paths.REDIRECT, getRedirect)
app.use(userRouter)

// Serve the entire directory and enable directory listing
const publicDirectory = join(__dirname, '..', 'files');
console.log(publicDirectory)
app.use('/files', express.static(publicDirectory), serveIndex(publicDirectory));

// Setup global error handler
app.use(setupNotFoundErrorHandler())
app.use(setupErrorHandler())

startServer(app)