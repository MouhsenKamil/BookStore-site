import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { logEvents } from '../middlewares/logger.ts'

import { HttpError, NewUserError } from '../utils/exceptions.ts'
import { createUserUtil } from '../utils/userUtils.ts'

import { User } from '../models/User.ts'
import {
  clearRefreshTokenFromCookies,
  getAccessToken,
  getRefreshToken,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
  updateTokensInCookies
} from '../utils/authUtils.ts'
import { authenticate } from '../middlewares/authMiddleware.ts'


export async function register(req: Request, res: Response) {
  const newUser = await createUserUtil(req, res)
    .catch(err => {
      if (err instanceof NewUserError) throw err
      throw new HttpError('Error while registering user', { cause: err })
    })

  const accessToken = await getAccessToken(newUser)
  setAccessTokenToCookies(res, accessToken)
  setRefreshTokenToCookies(res, await getRefreshToken(req, newUser, accessToken))

  res.sendStatus(204)
}


export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user)
    throw new HttpError('Invalid email id', {
      statusCode: 401,
      debugMsg: `Email id ${email} not registered`
    })

  // Validate username and password
  if (!user || !bcrypt.compareSync(password, user.passwordHash))
    throw new HttpError('Invalid password', {
      statusCode: 401,
      debugMsg: 'Invalid password provided for login'
    })

  // Issue access and refresh token to the user
  await updateTokensInCookies(req, res, user)
  res.sendStatus(204)

  logEvents(`User ${email} logged in`)
}


export async function refresh(req: Request, res: Response) {
  // Updates refresh token for client

  // All these verifications are done in authemticate middleware
  // So no need to do it again
  // const cookies = req.cookies as AuthCookies

  // if (Object.keys(cookies).length === 0) // If there are no cookies
  //   throw new HttpError('Unauthorized', { statusCode: 401 })

  // const {
  //   bs_rT: refreshToken, bs_aThp: accessTokenHeaderPayload, bs_aTs: accessTokenSign
  // } = cookies

  // if (!accessTokenHeaderPayload || !accessTokenSign)
  //   throw new HttpError('Invalid token', { statusCode: 401 })

  // const accessToken = `${accessTokenHeaderPayload}.${accessTokenSign}`

  // if (!accessToken)
  //   throw new HttpError('Unauthorized', { statusCode: 401 })

  // jwt.verify(
  //   refreshToken,
  //   env.REFRESH_TOKEN_SECRET,
  //   async (err, decoded) => {
  //     const _decoded = decoded as RefreshToken
  //     if (err)
  //       throw new HttpError('Unauthorized', { statusCode: 403, cause: err })

  //     const user = await User.findById(_decoded.id)
  //     if (!user)
  //       throw new HttpError('Unauthorized', { statusCode: 401 })

      
  //     // res.status(200).json({ accessToken, refreshToken })
  //     res.sendStatus(204)
  //   }
  // )

  const user = await User.findById(req.__userAuth.id)
  if (!user)
    throw new HttpError('Invalid session. User not found', { statusCode: 404 })

  await updateTokensInCookies(req, res, user)
}


export function logout(req: Request, res: Response) {
  clearRefreshTokenFromCookies(res)
  res.sendStatus(204)
}
