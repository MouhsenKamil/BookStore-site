import { v4 as uuid } from 'uuid'
import { createStream } from 'rotating-file-stream'
import path from 'path'


function logFilenameGenerator(filename: string) {
  return (time: number | Date, index?: number) => {
    if (!time)
      return filename

    const _time = (time instanceof Date) ? time.toUTCString() : time.toString()
    return `${time}-${index}-${filename}`;
  }
}

function createLogger(logFileName: string, logParentDirPath?: string) {
  let logDirPath = logParentDirPath ?? logFileName.slice(0, -4)
  return createStream(logFilenameGenerator(logFileName), {
    interval: '1d',
    size: '30M',
    maxSize: '30M',
    compress: 'gzip',
    path: path.join(__dirname, '..',  '..', 'logs', logParentDirPath ?? '', logDirPath),
  })
}


const userEventsLogger = createLogger('user-events.log')
const serverErrorsLogger = createLogger('server-errors.log')
const mongoDBErrorLogger = createLogger('mongodb-errors.log')
// const contactUsLogger = createLogger('contact-us.log')


// export function logEventsToFile(message: string) {
//   const logMsg = `${(new Date()).toISOString()} ${uuid()} ${message}\n`
//   // const logDir = path.join(__dirname, '..',  '..', 'logs', logFileName.slice(0, -4))

//   userEventsLogger.write(logMsg)
//     // if (!fs.existsSync(logDir))
//     //   await fs.promises.mkdir(logDir, { recursive: true })
//     // await fs.promises.appendFile(path.join(logDir, logFileName), logMsg)
// }

export function logEvents(message: string) {
  const logMsg = `${(new Date()).toISOString()} ${uuid()} ${message}\n`
  userEventsLogger.write(logMsg)
}

export function logServerErrors(message: string) {
  const logMsg = `${(new Date()).toISOString()} ${uuid()} ${message}\n`
  serverErrorsLogger.write(logMsg)
  console.error(logMsg)
}

export function logMongoDBErrors(err: Error) {
  const logMsg = `${(new Date()).toISOString()} ${uuid()} ${err}\n${err.stack}\n`
  mongoDBErrorLogger.write(logMsg)
  console.error(logMsg)
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
