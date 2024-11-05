import { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { UserType } from '../models/User'


export async function logEventsToFile(message: string, logFileName: string) {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '..',  '..', 'logs')))
      await fs.promises.mkdir(path.join(__dirname, '..',  '..', 'logs'))
    await fs.promises.appendFile(path.join(__dirname, '..',  '..', 'logs', logFileName), logItem)
  } catch (err) {
    console.error(err)
  }
}


export async function logEvents(message: string) {
  await logEventsToFile(message, 'eventsLog.log')
}


export async function logErrors(err: Error, errCode: number = 500, errLogFile: string = 'errLog.log') {
  console.error(err, err.stack || '', errCode)
  await logEventsToFile(`${err}\n${err.stack}`, errLogFile)
}


export async function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  let logFile = (req.__userAuth && req.__userAuth.type === UserType.ADMIN)
    ? 'admin-events.log' : 'inbound-requests.log'

  let message = (
    `${req.method}\t${req.url}\t` +
    `${req.headers.origin ?? 'unknown-origin'}\t${req.socket.remoteAddress}\n`
  )

  await logEventsToFile(message, logFile)
  next()
}
