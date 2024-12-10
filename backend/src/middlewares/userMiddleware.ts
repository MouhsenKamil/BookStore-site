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

    if (idFromParams !== '@me')// && idFromParams !== req.__userAuth.id)
      throw new HttpError('Forbidden', {
        statusCode: 403,
        debugMsg: 'user tried to interact with server as an another user via ' +
          `:${paramName} param in url (used '${idFromParams}' instead)`
      })
    next()
  }
}
