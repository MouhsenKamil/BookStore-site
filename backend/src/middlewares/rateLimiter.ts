import { Request, Response, NextFunction } from 'express'
import rateLimit, { Options } from 'express-rate-limit'
import { logEventsToFile } from './logger'


export function rateLimiter(message: string, timeWindowMS: number) {
  return rateLimit({
    windowMs: timeWindowMS,
    max: 5, // Limit each IP to 5 requests per `window` per minute
    message: {message: message},
    handler:  async (req: Request, res: Response, next: NextFunction, options: Options) => {
      await logEventsToFile(
        `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        'errLog.log'
      )
      res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
}
