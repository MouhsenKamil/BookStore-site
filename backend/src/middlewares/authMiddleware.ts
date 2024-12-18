import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import env from '../config/env.ts'

import { HttpError, ForceReLogin } from '../utils/exceptions.ts'
import { User, UserType } from '../models/User.ts'

import {
  // hashAccessToken,
  updateTokensInCookies, verifyAccessToken, verifyRefreshToken
} from '../utils/authUtils.ts'



async function checkAndRenewRefreshToken(
  refreshToken: string, req: Request, res: Response, err?: Error
) {
  // Access token is expired, thus create a new one from the existing refresh token
  const _decodedRT = await verifyRefreshToken(refreshToken)

  // if (_decodedRT.accessTokenHash !== await hashAccessToken(accessToken))
  //   // If the access token does not contain the actual hash of it's access token,
  //   // then its not related to it. Thus, its an invalid token.
  //   // But we can't give out a valid access token just by a access refresh token.
  //   // So we ask user to log in again.
  //   throw new ForceReLogin(
  //     'Invalid Token, re-login to continue', {
  //     cause: err as Error,
  //     debugMsg: 'Given access token is not related to the given refresh token. ' +
  //       'Forcing Forcing user to re-login to continue further'
  //   })

  if (_decodedRT.userAgent !== req.headers['user-agent'])
    // If the refresh token does not contain the same user agent,
    // then its not related to the previous system it's logged in.
    // Thus, its an invalid token.
    throw new ForceReLogin(
      'Invalid Token, re-login to continue', {
        cause: err as Error,
        debugMsg: 'Given access token is not related to the given refresh token. ' +
        'Forcing Forcing user to re-login to continue further'
      })

  // Issue new both the 'access' and 'refresh' tokens for client
  const user = await User.findOne(
    { _id: _decodedRT.id, type: _decodedRT.type, passwordHash: _decodedRT.passwordHash }
  )

  if (!user)
    throw new HttpError(
      'Invalid session for unknown user', {
        statusCode: 401,
        debugMsg: "user mentioned in refresh token does not exist. It's either " +
          "due to invalid user id or password in the refresh token"
      }
    )

  if (user.type !== UserType.ADMIN && user.blocked)
    throw new HttpError(
      'User is blocked by admin from accessing the site', {
        statusCode: 401,
        debugMsg : "User is blocked from logging in"
      }
    )

  req.__userAuth = { id: user.id, type: user.type }

  // Update the cookies with the new access and refresh tokens
  updateTokensInCookies(req, res, user)
}


export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const cookies = req.cookies as { [key: string]: string | undefined }

  // Unauthorized access or new user registration if there are no cookies
  if (!Object.keys(cookies).length)
    throw new HttpError('Unauthorized', {
      statusCode: 401,
      debugMsg: 'Cookies were empty while trying to authenticate user'
    })

  const refreshToken = cookies[env.REFRESH_TOKEN_COOKIE_NAME]
  const accessTokenHeaderPayload = cookies[env.ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME]
  const accessTokenSign = cookies[env.ACCESS_TOKEN_SIGN_COOKIE_NAME]

  if (!(accessTokenHeaderPayload || accessTokenSign) && refreshToken) {
    await checkAndRenewRefreshToken(refreshToken, req, res)
    return
  }
  // throw new HttpError('Access token not found', {
  //   statusCode: 401, debugMsg: 'access token not found in cookies while trying to authenticate'
  // })

  if (!refreshToken)
    throw new ForceReLogin('Invalid Token, re-login to continue', {
    debugMsg: 'refresh token not found in cookies while trying to authenticate'
  })

  const accessToken = `${accessTokenHeaderPayload}.${accessTokenSign}`

  await verifyAccessToken(accessToken)
    .then(async (_decodedAT) => {
      const user = await User.findOne(
        { _id: _decodedAT.id, type: _decodedAT.type, passwordHash: _decodedAT.passwordHash }
      )

      if (!user)
        throw new HttpError('Invalid session for unknown user', {
          statusCode: 401,
          debugMsg: "user mentioned in access token does not exist. It's either due to invalid " +
            "user id or password in the access token"
        })

      if (_decodedAT.passwordHash !== user.passwordHash)
        throw new ForceReLogin('Invalid Token, re-login to continue', {
          statusCode: 401, 
          debugMsg: 'Password reset has occurred. Forcing user to re-login to continue further'
        })

      if (user.type !== UserType.ADMIN && user.blocked)
        throw new HttpError(
          'User is blocked by admin from accessing the site', {
            statusCode: 401,
            debugMsg : "User is blocked from logging in"
          }
        )

      req.__userAuth = { id: user.id, type: user.type }
    })
    .catch(async (err) => {
      if (!(err instanceof TokenExpiredError))
        throw err

      await checkAndRenewRefreshToken(refreshToken, req, res, err)
    })

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
  const message = 'Redirect to continue'

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authenticate(req, res, () => {})
      if (yes !== undefined && Object.keys(yes).length) {
        res.status(yes.statusCode ?? 200).json({ message, url: yes.redirectTo })
        return
      }
    } catch {
      if (no !== undefined && Object.keys(no).length) {
        res.status(no.statusCode ?? 401).json({ message, url: no.redirectTo })
        return
      }
    }
    next()
  }
}


export function restrictToRoles(...roles: UserType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.__userAuth) {
      console.log(roles, req.__userAuth)
      throw new HttpError('Unauthorized', {
        statusCode: 401,
        debugMsg: 'Tried to access restricted resources without authentication. ' +
                  'This is caught in restrictToRoles middleware.'
      })
    }

    if (!roles.includes(req.__userAuth.type))
      throw new HttpError('Access denied', {
        statusCode: 403,
        debugMsg: `${req.__userAuth.type} user (id: ${req.__userAuth.id}) tried to access ` +
                  `this endpoint that's restricted to them. (tried to access ${req.method} ${req.url})`
      })

    next()
  }
}