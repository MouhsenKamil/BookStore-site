import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import env from '../config/env.ts'

import { HttpError, InvalidToken, RedirectTo } from '../utils/exceptions.ts'
import { User, UserType } from '../models/User.ts'
import {
  hashAccessToken, updateTokensInCookies, verifyAccessToken, verifyRefreshToken
} from '../utils/authUtils.ts'


export async function authenticate(req: Request, res: Response, next: NextFunction) {
  // const cookies = req.cookies as AuthCookies
  const cookies = req.cookies as { [key: string]: string | undefined }

  if (Object.keys(cookies).length === 0) // If there are no cookies
    throw new HttpError('Unauthorized', { statusCode: 401 })

  const refreshToken = cookies[env.REFRESH_TOKEN_COOKIE_NAME]
  const accessTokenHeaderPayload = cookies[env.ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME]
  const accessTokenSign = cookies[env.ACCESS_TOKEN_SIGN_COOKIE_NAME]

  if (!accessTokenHeaderPayload || !accessTokenSign)
    throw new InvalidToken('Invalid access token', { statusCode: 401 })

  if (!refreshToken)
    throw new InvalidToken('Invalid token', { statusCode: 401 })

  const accessToken = `${accessTokenHeaderPayload}.${accessTokenSign}`

  await verifyAccessToken(accessToken)
    .catch(async (err) => {
      if (!(err instanceof TokenExpiredError)) throw err

      // Access token is expired, thus create a new one from the existing refresh token
      const _decodedRT = await verifyRefreshToken(refreshToken)

      if (_decodedRT.accessTokenHash !== await hashAccessToken(accessToken))
        // If the access token does not contain the hash of it's refresh token,
        // then its not related to it. Thus, its an invalid token.
        // But we can't give out a valid access token just by a random refresh token.
        // So we ask user to log in again.
        throw new RedirectTo(
          'Invalid Token, Login to continue', '/login', {
            statusCode: 308,
            cause: err as Error,
            debugMsg: 'Given access token is not related to the given refresh token'
          }
        )

      // Issue new both the 'access' and 'refresh' tokens for client
      const user = await User.findById(_decodedRT.id)

      if (!user)
        throw new HttpError('Invalid session for unknown user', { statusCode: 401 })

      req.__userAuth = {
        id: user._id as string,
        type: user.type,
      }

      // Update the cookies with the new access and refresh tokens
      await updateTokensInCookies(req, res, user)
    }
  )

  next()
}


interface RedirectToProp {
  redirectTo: string
  statusCode: number
}


type IsAuthenticatedProps = {
  yes: RedirectToProp,
  no?: RedirectToProp
} | {
  yes?: RedirectToProp,
  no: RedirectToProp
}


export function IsAuthenticated(props: IsAuthenticatedProps) {
  const { yes, no } = props

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      authenticate(req, res, () => {})
      if (yes !== undefined && Object.keys(yes).length !== 0) {
        res.send(yes.statusCode).location(yes.redirectTo)
        return
      }
    } catch {
      if (no !== undefined && Object.keys(no).length !== 0) {
        res.send(no.statusCode).location(no.redirectTo)
        return
      }
    }
    next()
  }
}


export function restrictToRoles(...roles: UserType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.__userAuth.type))
      throw new HttpError('Access denied', { statusCode: 403 })
    next()
  }
}
