import { Request, Response, NextFunction } from 'express'

import { logEventsToFile } from './logger'
import { BackendError, HttpError, ForceReLogin } from '../utils/exceptions'
import { clearTokensInCookies } from '../utils/authUtils'


export default async function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  const message = (err instanceof BackendError) ? err.message: 'Internal Server Error'
  const statusCode = err.statusCode ?? 500

  let logMsg = (
    `${err.name}: ${message}\t${req.method}\t${req.url}\t` +
    `${req.headers.origin ?? 'Unknown-Origin'}\t${req.socket.remoteAddress}\n`
  )

  if (err instanceof HttpError)
    logMsg += `DEBUG: ${err.debugMsg}\n`

  // query and params are already available via url
  // let query_str = JSON.stringify(req.query)
  // if (query_str !== '{}')
  //   logMsg += `query=${query_str}\n`

  // let params_str = JSON.stringify(req.params)
  // if (params_str !== '{}')
  //   logMsg += `params=${params_str}\n`

  // There's no need for now to include body
  // let body_str = JSON.stringify(req.body)
  // if (body_str !== '{}')
  //   logMsg += `body=${body_str}\n`

  logMsg += err.stack ?? ''

  await logEventsToFile(logMsg, 'server-errors.log')

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
