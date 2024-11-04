import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { logEventsToFile } from './logger'
import { BackendError, HttpError } from '../utils/exceptions'


export default async function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500
  const message = (err instanceof BackendError) ? err.message: 'Internal Server Error'

  let logMsg = (
    `${err.name}: ${message}\t${req.method}\t${req.url}\t` +
    `${req.headers.origin ?? 'Unknown-Origin'}\t${req.socket.remoteAddress}\n`
  )

  let query_str = JSON.stringify(req.query)
  if (query_str !== '{}')
    logMsg += `query=${query_str}\n`

  let params_str = JSON.stringify(req.params)
  if (params_str !== '{}')
    logMsg += `params=${params_str}\n`

  let body_str = JSON.stringify(req.body)
  if (body_str !== '{}')
    logMsg += `body=${body_str}\n`

  logMsg += err.stack ?? ''

  await logEventsToFile(logMsg, 'errLog.log')
  res.status(statusCode).json({ message })
  console.error(err)
}
