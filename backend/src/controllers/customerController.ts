import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { HttpError, NewUserError } from '../utils/exceptions.ts'
import { Customer } from '../models/Customer.ts'
import { logEvents } from '../middlewares/logger.ts'
import { CreditCard } from '../models/CreditCard.ts'


export async function createCustomer(req: Request, res: Response) {
  const userExists = await Customer.findOne({ email: req.body.email })
  if (userExists)
    throw new NewUserError('User already exists', {
      statusCode: 409,
      debugMsg: "Tried to create a new user with an another pre-existing user's email id"
    })

  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  req.body.passwordHash = hashedPassword
  delete req.body.password

  const newUser = new Customer(req.body)

  await newUser.save()
    .catch(async (err) => {
      throw new HttpError(
        (err instanceof NewUserError) ? err.message : 'Error occurred while registering user',
        { cause: err }
      )
    })

  logEvents(`New user account created: ${newUser._id}`)
  // res.status(201).json({ message: 'User account created successfully', userId: newUser._id })

  return newUser
}


export async function getCustomers(req: Request, res: Response) {
  const { query, limit = '0', fields = '', sort = 'name', order = 'asc' } = req.query
  const queryObj = query
    // ? { name: { $regex: (query as string).replace('/', '\\/'), $options: 'i' } }
    ? { name: { $regex: (query as string).replace('/', '\\/'), $options: 'i' } }
    : {}

  const orderStr = (order as string).toLowerCase()

  if (!['asc', 'desc'].includes(orderStr))
    throw new HttpError(`Invalid value for sort order: ${order}`, { statusCode: 400 })

  const orderInt = (orderStr === 'asc') ? 1: -1

  let fieldsArr = (fields as string).trim().split(',')

  let projectionObj: Record<string, 1 | -1> = Object.fromEntries(
    fieldsArr.map(elem => [elem, 1])
  )
  projectionObj.id = projectionObj.id ?? 0

  const limitInt = +limit

  const resUsers = await Customer.aggregate([
    { $match: queryObj },
    { $limit: limitInt },
    { $sort: { [sort as string]: orderInt }},
    { $project: { ...projectionObj, passwordHash: 0 }}
  ]).catch(err => {
    throw new HttpError('Error occurred while fetching users', { cause: err })
  })

  res.status(200).json({ total: resUsers.length, results: resUsers })
}


export async function getCustomerById(req: Request, res: Response) {
  const { userId } = req.params
  const user = await Customer.findById(userId, { _id: 0, passwordHash: 0 })
    .catch(err => {
      throw new HttpError("Error occurred while fetching user's details", { cause: err })
    })

  if (!user)
    throw new HttpError('User not found', { statusCode: 404 })

  res.status(200).json(user)
}


export async function updateCustomer(req: Request, res: Response) {
  await Customer.findByIdAndUpdate(
    req.params.userId, req.body, { runValidators: true, new: true }
  ).catch(err => {
    throw new HttpError('Error occurred while updating user', { cause: err })
  })

  res.status(204)
}


// export async function changeUserPassword(req: Request, res: Response) {
//   const { oldPasswordHash, newPasswordHash } = req.body
//   const user = await Customer.findById(req.params.userId)
//   if (!user)
//     throw new HttpError('User not found', { statusCode: 404 })

//   if (user.passwordHash !== oldPasswordHash)
//     throw new HttpError(
//       'old password is not matching with the current password', { statusCode: 401 }
//     )

//   const updatedUser = await user.updateOne(
//     { passwordHash: newPasswordHash }, { runValidators: true, new: true }
//   )
//   .catch(err => {
//     throw new HttpError('Error occurred while updating password', { cause: err })
//   })

//   console.log('from updatecustomer func', JSON.stringify(updatedUser))

//   await updateTokensInCookies(req, res, updatedUser)
//   res.sendStatus(204)
// }


export async function deleteCustomer(req: Request, res: Response) {
  const { userId } = req.params
  const deletedUser = await Customer.findByIdAndDelete(userId)
    .catch(err => {
      throw new HttpError('Error occurred while deleting the user', { cause: err })
    })

  if (!deletedUser)
    throw new HttpError('Error occurred while deleting user', {
      statusCode: 404,
      debugMsg: 'Tried to delete a non-existing user'
    })

  res.sendStatus(204)
}


export async function blockCustomer(req: Request, res: Response) {
  const { userId } = req.params
  await Customer.findByIdAndUpdate(userId, { blocked: true }, { runValidators: true })
    .catch(err => {
      throw new HttpError('Error occurred while blocking the user', { cause: err })
    })
  res.sendStatus(204)
}


export async function unblockCustomer(req: Request, res: Response) {
  await Customer.findByIdAndUpdate(
    req.params.userId, { blocked: false }, { runValidators: true }
  ).catch(err => {
      throw new HttpError('Error occurred while unblocking the user', { cause: err })
    })

  res.sendStatus(204)
}


// export async function becomeSeller(req: Request, res: Response) {
//   await User.findByIdAndUpdate(
//     req.params.userId, { type: UserType.SELLER }, { runValidators: true }
//   ).catch(err => {
//       throw new HttpError('Error occurred while making the user to a seller', { cause: err })
//     })
//   res.sendStatus(204)
// }


export async function addCreditCard(req: Request, res: Response) {
  try {
    const newCreditCard = new CreditCard(req.body)
    await newCreditCard.save()

    req.body = {
      $addToSet: { creditCards: newCreditCard._id }
    }

    await updateCustomer(req, res)
  } catch (err) {
    throw new HttpError(
      'Error occurred while registering the credit card', { cause: err as Error }
    )
  }
}


export async function getCreditCardsOfUser(req: Request, res: Response) {
  const creditCards = await Customer.aggregate([
    { $match: { _id: req.params.userId }},
    {
      $lookup: {
        from: "users",
        localField: "creditCards",
        foreignField: "_id",
        as: "creditCardsInfo"
      }
    },
    { $project: { _id: 0, creditCards: 0 }}
  ])

  res.status(200).json({ total: creditCards.length, results: creditCards })
}


export async function deleteCreditCard(req: Request, res: Response) {
  const { cardId } = req.params

  try {
    const creditCard = await CreditCard.findById(cardId)
    if (!creditCard)
      throw new HttpError('credit card not found', {
        statusCode: 404,
        debugMsg: "Trying to delete a credit card that doesn't exist"
      })

    req.body = {
      $pull: { creditCards: cardId }
    }

    await updateCustomer(req, res)
  } catch (err) {
    throw new HttpError(
      'Error occurred while registering the credit card', { cause: err as Error }
    )
  }}
