import { Request, Response, NextFunction } from "express"
import { UserType } from "../models/User"


export function verifyUserIdParamByUserAuth(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.__userAuth.type === UserType.ADMIN) {
      next()
      return
    }

    const idFromParams = req.params[paramName]

    if (idFromParams !== req.__userAuth.id || idFromParams !== '@me') {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

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
