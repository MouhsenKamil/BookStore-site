import { Request, Response, NextFunction } from 'express'

import { logServerErrors } from './logger'
import { BackendError, HttpError, ForceReLogin } from '../utils/exceptions'
import { clearTokensInCookies } from '../utils/authUtils'


export default function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  const message = (err instanceof BackendError) ? err.message: 'Internal Server Error'
  const statusCode = err.statusCode ?? 500

  let logMsg = (
    `${err.name}: ${message}\t${req.method}\t${req.url}\t` +
    `${req.headers.origin ?? 'Unknown-Origin'}\t${req.socket.remoteAddress}\n`
  )

  if (err instanceof HttpError)
    logMsg += `DEBUG: ${err.debugMsg}\n`

  logMsg += err.stack ?? ''

  logServerErrors(logMsg)

  // Handle 'Redirect' errors to forcefully logout clients and let them re-log
  res.status(statusCode)

  if (!(err instanceof ForceReLogin))
    res.json({ message })

  else {
    clearTokensInCookies(res)
    res.location('/login')
  }

  console.error(err)
}
