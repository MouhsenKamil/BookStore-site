import { v4 as uuid } from 'uuid'
import { createStream } from 'rotating-file-stream'
import path from 'path'


function logFilenameGenerator(filename: string) {
  return (time: number | Date, index?: number) => {
    if (!time)
      return filename

    const _time = (time instanceof Date) ? time.toISOString() : time.toString()
    return `${time}-${index}-${filename}`;
  }
}

function createLogger(logFileName: string, logParentDirPath?: string) {
  let logDirPath = logParentDirPath ?? logFileName.slice(0, -4)
  return createStream(logFilenameGenerator(logFileName), {
    interval: '1d',
    maxSize: '30M',
    compress: 'gzip',
    path: path.join(__dirname, '..',  '..', 'logs', logParentDirPath ?? '', logDirPath),
  })
}


const userEventsLogger = createLogger('user-events.log')
const serverErrorsLogger = createLogger('server-errors.log')
const mongoDBErrorLogger = createLogger('mongodb-errors.log')
// const contactUsLogger = createLogger('contact-us.log')


export function logEventsToFile(message: string) {
  const logItem = `${(new Date()).toISOString()} ${uuid()} ${message}\n`
  // const logDir = path.join(__dirname, '..',  '..', 'logs', logFileName.slice(0, -4))

  userEventsLogger.write(logItem)
    // if (!fs.existsSync(logDir))
    //   await fs.promises.mkdir(logDir, { recursive: true })
    // await fs.promises.appendFile(path.join(logDir, logFileName), logItem)
}

export function logEvents(message: string) {
  userEventsLogger.write(message)
}

export function logServerErrors(message: string) {
  serverErrorsLogger.write(message)
  console.error(message)
}

export function logMongoDBErrors(err: Error) {
  let message = `${err}\n${err.stack}`
  mongoDBErrorLogger.write(message)
  console.error(message)
}

// export function logContactUsContent(name: string, email: string, message: string) {
//   let msgRes = `EMAIL FROM SITE: ${name} (${email})\n${message}\n---`
//   console.log(msgRes)
//   // contactUsLogger.write(msgRes)
// }

// export async function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
//   let logFile = (req.__userAuth && req.__userAuth.type === UserType.ADMIN)
//     ? 'admin-events.log' : 'inbound-requests.log'

//   let message = (
//     `${req.method}\t${req.url}\t` +
//     `${req.headers.origin ?? 'unknown-origin'}\t${req.socket.remoteAddress}\n`
//   )

//   await logEventsToFile(message, logFile)
//   next()
// }
