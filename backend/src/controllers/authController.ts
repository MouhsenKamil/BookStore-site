import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { logEvents } from '../middlewares/logger.ts'
import { ForceReLogin, HttpError } from '../utils/exceptions.ts'
import { clearRefreshTokenFromCookies, updateTokensInCookies } from '../utils/authUtils.ts'
import { User, UserDoc, UserType } from '../models/User.ts'
import { Customer } from '../models/Customer.ts'
import { Seller } from '../models/Seller.ts'
import { createCustomer } from './customerController.ts'
import { createSeller } from './sellerController.ts'
import { Admin } from '../models/Admin.ts'


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

  await updateTokensInCookies(req, res, newUser)

  // res.sendStatus(204)
  res.status(200).json({ message: 'User registered successfully' })
}


export async function login(req: Request, res: Response) {
  const { email, password, type: userType } = req.body

  // const user = await User.findOne({ email })
  // if (!user)
  //   throw new HttpError('Invalid email id', {
  //     statusCode: 401,
  //     debugMsg: `Email id ${email} not registered`
  //   })

  let user

  if (userType === UserType.CUSTOMER)
    user = await Customer.findOne({ email })

  else if (userType === UserType.SELLER)
    user = await Seller.findOne({ email })

  else if (userType === UserType.ADMIN)
    user = await Admin.findOne({ email })

  else
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

  if (userType !== UserType.ADMIN && user.blocked)
    throw new HttpError(
      'User is blocked by admin from accessing the site', {
        statusCode: 401,
        debugMsg : "User is blocked from logging in"
      }
    )

  // Issue access and refresh token to the user
  await updateTokensInCookies(req, res, user)

  res.status(200).json({ message: 'Redirect to continue', url: '/' })

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

  let { id: userId, type: userType} = req.__userAuth
  let user

  if (userType === UserType.CUSTOMER)
    user = await Customer.findById(userId)

  else if (userType === UserType.SELLER)
    user = await Seller.findById(userId)

  else if (userType === UserType.ADMIN)
    user = await Admin.findById(userId)

  else
    throw new HttpError(
      `Invalid session. Unknown user type: ${userType}`, { statusCode: 404 }
    )

  if (!user)
    throw new HttpError('Invalid session. User not found', { statusCode: 404 })

  await updateTokensInCookies(req, res, user)
}


export function logout(req: Request, res: Response) {
  clearRefreshTokenFromCookies(res)
  res.send(200).json({ message: "Logged out successfully", url: '/' })
}


export async function verify(req: Request, res: Response) {
  let userType = req.__userAuth.type
  let user

  console.log('from verify: ', req.cookies)

  try {
    if (userType === UserType.CUSTOMER)
      user = await Customer.findById(
        req.__userAuth.id, { _id: 0, passwordHash: 0, blocked: 0 }
      )

    else if (userType === UserType.SELLER)
      user = await Seller.findById(
        req.__userAuth.id, { _id: 0, passwordHash: 0, blocked: 0 }
      )

    else if (userType === UserType.ADMIN)
      user = await Admin.findById(
        req.__userAuth.id, { _id: 0, passwordHash: 0, blocked: 0 }
      )

    else
      throw new HttpError(`Unknown user type: ${userType}`, {
        statusCode: 400,
        debugMsg: `Got '${userType}' as user type while trying to register user`
      })

    // const user = await User.findById(
    //   req.__userAuth.id, { _id: 0, passwordHash: 0, blocked: 0 }
    // )

    if (!user)
      return // Unreachable code
      // authentication is required to run this code. Thus no need to
      // check whether user exists or not

    res.status(200).json({ userData: user.toJSON() })
  } catch (err) {
    throw new ForceReLogin("Unable to verify and get id's", { cause: err as Error })
  }
}


export async function changePassword(req: Request, res: Response) {
  const { id: userId, type: userType } = req.__userAuth
  let user
  
  if (userType === UserType.CUSTOMER)
    user = await Customer.findById(userId)

  else if (userType === UserType.SELLER)
    user = await Seller.findById(userId)

  else
    throw new HttpError(`Unknown user type: ${userType}`, {
      statusCode: 400,
      debugMsg: `Got '${userType}' as user type while trying to change password`
    })

  // const userDoc = await User.findById(userId)
  
  if (!user)
    throw new HttpError(req.__userAuth.type + ' not found', { statusCode: 404 })
  
  const { oldPassword, newPassword } = req.body

  const [oldPasswordHash, newPasswordHash] = await Promise.all([
    bcrypt.hash(oldPassword, 12), bcrypt.hash(newPassword, 12)
  ])

  if (user.passwordHash !== oldPasswordHash)
    throw new HttpError(
      'old password is not matching with the current password', { statusCode: 401 }
    )

  if (oldPassword === newPassword)
    throw new HttpError(
      'New password cannot be same as old password', { statusCode: 409 }
    )

  // if (userType === UserType.CUSTOMER)
  //   updatedUser = await Customer.findByIdAndUpdate(
  //     user.id, { passwordHash: newPasswordHash }, { runValidators: true, new: true }
  //   )

  // else if (userType === UserType.SELLER)
  //   updatedUser = await Seller.findByIdAndUpdate(
  //     user.id, { passwordHash: newPasswordHash }, { runValidators: true, new: true }
  //   )

  // else
  //   throw new HttpError(`Unknown user type: ${userType}`, {
  //     statusCode: 400,
  //     debugMsg: `Got '${userType}' as user type while trying to register user`
  //   })

  await user.updateOne({ passwordHash: newPasswordHash }, { new: true })
    .catch(err => {
      throw new HttpError('Error occurred while updating password', { cause: err as Error })
    })

  await updateTokensInCookies(req, res, user)
  logEvents(`${userType} ${userId} has changed their password`)
  res.sendStatus(204)
}
