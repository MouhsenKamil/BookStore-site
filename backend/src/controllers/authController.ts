import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { logEvents } from '../middlewares/logger.ts'

import { ForceReLogin, HttpError } from '../utils/exceptions.ts'

import {
  clearRefreshTokenFromCookies,
  getAccessToken,
  getRefreshToken,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
  updateTokensInCookies
} from '../utils/authUtils.ts'
import { User, UserDoc, UserType } from '../models/User.ts'
import { Customer } from '../models/Customer.ts'
import { Seller } from '../models/Seller.ts'
import { createCustomer } from './customerController.ts'
import { createSeller } from './sellerController.ts'


export async function register(req: Request, res: Response) {
  // const newUser = await createUserUtil(req, res)
  //   .catch(err => {
  //     if (err instanceof NewUserError) throw err
  //     throw new HttpError('Error occurred while registering user', { cause: err })
  //   })

  const { type: userType } = req.body
  let newUser

  if (userType === UserType.CUSTOMER)
    newUser = await createCustomer(req, res)

  else if (userType === UserType.SELLER)
    newUser = await createSeller(req, res)

  else
    throw new HttpError(`Unknown user type: ${userType}`, {
      statusCode: 400,
      debugMsg: `Got '${userType}' as user type while trying to register user`
    })

  const accessToken = await getAccessToken(newUser)
  setAccessTokenToCookies(res, accessToken)
  setRefreshTokenToCookies(res, await getRefreshToken(req, newUser, accessToken))

  // res.sendStatus(204)
  res.status(308).location('/')
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
  // res.sendStatus(204)
  res.status(308).location('/')

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


export async function verify(req: Request, res: Response) {
  const user = await User.findById(
    req.__userAuth.id, { _id: 0, passwordHash: 0, blocked: 0 }
  ).catch(err => {
    throw new ForceReLogin("Unable to veify and geti's ", { cause: err })
  })

  if (!user)
    return // Unreachable code

  res.status(200).json({ userData: user.toJSON() })
}


export async function changePassword(req: Request, res: Response) {
  const { oldPasswordHash, newPasswordHash } = req.body
  const { id: userId, type: userType } = req.__userAuth

  const userDoc = await User.findById(userId)

  if (!userDoc)
    throw new HttpError(req.__userAuth.type + ' not found', { statusCode: 404 })

  if (userDoc.passwordHash !== oldPasswordHash)
    throw new HttpError(
      'old password is not matching with the current password', { statusCode: 401 }
    )

  let updatedUser

  if (userType === UserType.CUSTOMER)
    updatedUser = await Customer.findByIdAndUpdate(
      userDoc.id, { passwordHash: newPasswordHash }, { runValidators: true, new: true }
    )

  else if (userType === UserType.SELLER)
    updatedUser = await Seller.findByIdAndUpdate(
      userDoc.id, { passwordHash: newPasswordHash }, { runValidators: true, new: true }
    )

  else
    return // Unreachable code

  // .catch(err => {
  //   throw new HttpError('Error occurred while updating password', { cause: err as Error })
  // })

  await updateTokensInCookies(req, res, updatedUser as UserDoc)
  logEvents(`${userType} ${userId} has changed their password`)
  res.sendStatus(204)
}
