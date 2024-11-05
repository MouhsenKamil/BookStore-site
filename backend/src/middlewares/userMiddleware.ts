import { Request, Response, NextFunction } from "express"
import { UserType } from "../models/User"

import { HttpError } from "../utils/exceptions"


export function verifyUserIdParamByUserAuth(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.__userAuth.type === UserType.ADMIN) {
      next()
      return
    }

    const idFromParams = req.params[paramName]

    if (idFromParams !== req.__userAuth.id || idFromParams !== '@me')
      throw new HttpError('Forbidden', {
        statusCode: 403,
        debugMsg: 'user tried to interact with server as an another user via ' +
                  `:${paramName} param in url`
      })

    next()
  }
}


export function parseMeInParams(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.params[paramName] == '@me')
      req.params[paramName] = req.__userAuth.id

    next()
  }
}
