import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { User, UserType } from '../models/User.ts'
import { createUserUtil } from '../utils/userUtils.ts'
import { HttpError, NewUserError } from '../utils/exceptions.ts'
import { updateTokensInCookies } from '../utils/authUtils.ts'


export async function getUsers(req: Request, res: Response) {
  const { query, limit = '0', fields = '' } = req.query
  const query_obj = query
    ? { name: { $regex: (query as string).replace('/', '\\/'), $options: 'i' } }
    : {}

  let projection_obj: Record<string, 1 | -1> | null = null
  let fields_arr = (fields as string).trim().split(',')

  if (fields_arr.length > 0)
    projection_obj = Object.fromEntries(fields_arr.map(elem => [elem, 1]))

  const limit_int = parseInt(limit as string)

  const resUsers = await User.aggregate([
    { $match: query_obj },
    { $limit: limit_int },
    {
      $project: { ...projection_obj, _id: 0, passwordHash: 0 }
    }
  ]).catch(err => {
    throw new HttpError('Error while fetching users', { cause: err })
  })

  res.status(200).json(resUsers)
}


export async function getUserById(req: Request, res: Response) {
  const { userId } = req.params
  const user = await User.findById(userId, { passwordHash: 0 })
    .catch(err => {
      throw new HttpError("Error while fetching user's details", { cause: err })
    })

  if (!user)
    throw new HttpError('User not found', { statusCode: 404 })

  res.status(200).json(user)
}


export async function createUser(req: Request, res: Response) {
  const userExists = await User.findOne({ email: req.body.email })
  if (userExists)
    throw new NewUserError('User already exists', {
      statusCode: 409,
      debugMsg: "Tried to create a new user with an another pre-existing user's email id"
    })

  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  req.body.passwordHash = hashedPassword
  delete req.body.password

  const user = await createUserUtil(req, res)
    .catch(async (err) => {
      throw new HttpError(
        (err instanceof NewUserError) ? err.message : 'Error while registering user',
        { cause: err }
      )
    })

  res.status(201).json({ userId: user._id })
}


export async function updateUser(req: Request, res: Response) {
  await User.findByIdAndUpdate(
    req.params.userId, req.body, { runValidators: true, new: true }
  ).catch(err => {
    throw new HttpError('Error while updating user', { cause: err })
  })

  res.status(204)
}


export async function changePassword(req: Request, res: Response) {
  const { oldPasswordHash, newPasswordHash } = req.body
  const user = await User.findById(req.params.userId)
  if (!user)
    throw new HttpError('User not found', { statusCode: 404 })

  if (user.passwordHash !== oldPasswordHash)
    throw new HttpError(
      'old password is not matching with the current password', { statusCode: 401 }
    )

  const updatedUser = await user.updateOne(
    { passwordHash: newPasswordHash }, { runValidators: true, new: true }
  )
  .catch(err => {
    throw new HttpError('Error while updating password', { cause: err })
  })

  console.log('from updateuser func', JSON.stringify(updatedUser))

  await updateTokensInCookies(req, res, updatedUser)
  res.sendStatus(204)
}


export async function deleteUser(req: Request, res: Response) {
  const { userId } = req.params
  const deletedUser = await User.findByIdAndDelete(userId)
    .catch(err => {
      throw new HttpError('Error while deleting the user', { cause: err })
    })

  if (!deletedUser)
    throw new HttpError('Error while deleting user', {
      statusCode: 404,
      debugMsg: 'Tried to delete a non-existing user'
    })

  res.sendStatus(204)
}


export async function blockUser(req: Request, res: Response) {
  const { userId } = req.params
  await User.findByIdAndUpdate(userId, { blocked: true }, { runValidators: true })
    .catch(err => {
      throw new HttpError('Error while blocking the user', { cause: err })
    })
  res.sendStatus(204)
}


export async function unblockUser(req: Request, res: Response) {
  await User.findByIdAndUpdate(
    req.params.userId, { blocked: false }, { runValidators: true }
  ).catch(err => {
      throw new HttpError('Error while unblocking the user', { cause: err })
    })
  res.sendStatus(204)
}


export async function becomeSeller(req: Request, res: Response) {
  await User.findByIdAndUpdate(
    req.params.userId, { type: UserType.SELLER }, { runValidators: true }
  ).catch(err => {
      throw new HttpError('Error while making the user to a seller', { cause: err })
    })
  res.sendStatus(204)
}
