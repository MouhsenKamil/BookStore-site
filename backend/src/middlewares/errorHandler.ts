import { NextFunction, Request, Response } from 'express'

import { logServerErrors } from './logger'
import { BackendError, HttpError, ForceReLogin } from '../utils/exceptions'
import { clearTokensInCookies } from '../utils/authUtils'


export default function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent)
    return next(err)

  let error = (err instanceof BackendError) ? err.message: 'Internal Server Error'

  if (err instanceof HttpError && err.cause instanceof Error && err.cause.name === "ValidationError")
    error += '\n' + err.cause.message

  const statusCode = err.statusCode ?? 500

  let logMsg = (
    `${err.name}: ${error} ${req.method} ${req.url} ` +
    `${req.headers.origin ?? 'Unknown-Origin'} ${req.socket.remoteAddress}\n`
  )

  if (err instanceof HttpError)
    logMsg += `DEBUG: ${err.debugMsg}\n`

  logMsg += err.stack ?? ''

  logServerErrors(logMsg)

  // Handle 'Redirect' errors to forcefully logout clients and let them re-log
  if (!(err instanceof ForceReLogin))
    res.status(statusCode).json({ error })

  else {
    clearTokensInCookies(res)
    res.status(statusCode).location('/login')
  }

  console.error(err, err.stack || '')
}
