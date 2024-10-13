import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UserType } from '../models/User'

export interface UserAuthData {
  id: string,
  type: UserType,
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !(authHeader as string).startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }

      const _decoded = decoded as UserAuthData

      req.__userAuth = {
        id: _decoded.id,
        type: _decoded.type,
      }

      next()
    })
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}

export function restrictToRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.__userAuth.type)) {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    next();
  }
}
