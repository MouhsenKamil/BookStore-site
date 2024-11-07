import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import env from '../config/env.ts'

import { HttpError, ForceReLogin } from '../utils/exceptions.ts'
import { User, UserType } from '../models/User.ts'
import {
  hashAccessToken, updateTokensInCookies, verifyAccessToken, verifyRefreshToken
} from '../utils/authUtils.ts'


export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const cookies = req.cookies as { [key: string]: string | undefined }

  // Unauthorized access or new user registration if there are no cookies
  if (Object.keys(cookies).length === 0)
    throw new HttpError('Unauthorized', {
      statusCode: 401,
      debugMsg: 'Cookies were empty while trying to authenticate user'
    })

  const refreshToken = cookies[env.REFRESH_TOKEN_COOKIE_NAME]
  const accessTokenHeaderPayload = cookies[env.ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME]
  const accessTokenSign = cookies[env.ACCESS_TOKEN_SIGN_COOKIE_NAME]

  if (!accessTokenHeaderPayload || !accessTokenSign)
    throw new HttpError('Access token not found', {
      statusCode: 401, debugMsg: 'access token not found in cookies while trying to authenticate'
    })

  if (!refreshToken)
    throw new ForceReLogin('Invalid Token, re-login to continue', {
      debugMsg: 'refresh token not found in cookies while trying to authenticate'
    })

  const accessToken = `${accessTokenHeaderPayload}.${accessTokenSign}`

  await verifyAccessToken(accessToken)
    .then(async (_decodedAT) => {
      const user = await User.findById(_decodedAT.id, { _id: 0, passwordHash: 1 })

      if (!user)
        throw new HttpError('Invalid session for unknown user', {
          statusCode: 401, debugMsg: 'user id mentioned in access token does not exist'
        })

      if (_decodedAT.passwordHash !== user.passwordHash)
        throw new ForceReLogin('Invalid Token, re-login to continue', {
          debugMsg: 'Password reset has occurred. Forcing user to re-login to continue further'
        })
    })
    .catch(async (err) => {
      if (!(err instanceof TokenExpiredError)) throw err

      // Access token is expired, thus create a new one from the existing refresh token
      const _decodedRT = await verifyRefreshToken(refreshToken)

      if (_decodedRT.accessTokenHash !== await hashAccessToken(accessToken))
        // If the access token does not contain the actual hash of it's access token,
        // then its not related to it. Thus, its an invalid token.
        // But we can't give out a valid access token just by a access refresh token.
        // So we ask user to log in again.
        throw new ForceReLogin(
          'Invalid Token, re-login to continue', {
            cause: err as Error,
            debugMsg: 'Given access token is not related to the given refresh token. ' +
                      'Forcing Forcing user to re-login to continue further'
          }
        )

      if (_decodedRT.userAgent !== req.headers['user-agent'])
        // If the refresh token does not contain the same user agent,
        // then its not related to the previous system it's logged in.
        // Thus, its an invalid token.
        throw new ForceReLogin(
          'Invalid Token, re-login to continue', {
            cause: err as Error,
            debugMsg: 'Given access token is not related to the given refresh token. ' +
                      'Forcing Forcing user to re-login to continue further'
          }
        )

      // Issue new both the 'access' and 'refresh' tokens for client
      const user = await User.findById(_decodedRT.id, { type: 1 })

      if (!user)
        throw new HttpError(
          'Invalid session for unknown user', {
            statusCode: 401,
            debugMsg: 'user id mentioned in refresh token does not exist'
          }
        )

      req.__userAuth = {
        id: user._id as string,
        type: user.type
      }

      // Update the cookies with the new access and refresh tokens
      await updateTokensInCookies(req, res, user)
    }
  )

  next()
}


interface RedirectToProp {
  redirectTo: string
  statusCode?: number
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

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authenticate(req, res, (...args) => {})
      if (yes !== undefined && Object.keys(yes).length !== 0) {
        res.status(yes.statusCode ?? 308).location(yes.redirectTo)
        return
      }
    } catch {
      if (no !== undefined && Object.keys(no).length !== 0) {
        res.status(no.statusCode ?? 308).location(no.redirectTo)
        return
      }
    }
    next()
  }
}


export function restrictToRoles(...roles: UserType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.__userAuth.type))
      throw new HttpError('Access denied', {
        statusCode: 403,
        debugMsg: `${req.__userAuth.type} user (id: ${req.__userAuth.id}) tried to access ` +
                  `this endpoint that's restricted to them.`
      })
    next()
  }
}
