import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { HttpError } from '../utils/exceptions.ts'
import { addBook } from './bookController.ts'

import { Book } from '../models/Book.ts'
import { BookArchive } from '../models/BooksArchive.ts'
import { Seller } from '../models/Seller.ts'
import { deleteCustomer } from './customerController.ts'
import { logEvents } from '../middlewares/logger.ts'


export async function createSeller(req: Request, res: Response) {
  const sellerExists = await Seller.findOne({ email: req.body.email })

  if (sellerExists)
    throw new HttpError('Seller already exists', {
      statusCode: 409,
      debugMsg: "Tried to create a new seller with an another pre-existing seller's email id"
    })

  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  req.body.passwordHash = hashedPassword
  delete req.body.password

  const newSeller = new Seller(req.body)
  await newSeller.save()
    .catch(err => {
      throw new HttpError('Error occurred while adding seller', { cause: err })
    })

  logEvents(`New seller account created: ${newSeller._id}`)
  // res.status(201).json({ message: 'Seller account created successfully', userId: newSeller._id })

  return newSeller
}


export async function getSellers(req: Request, res: Response) {
  const { query, limit = '0', fields = '', sort = 'name', order = 'asc' } = req.query
  const queryObj = query
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

  const resSellers = await Seller.aggregate([
    { $match: queryObj },
    { $limit: limitInt },
    { $sort: { [sort as string]: orderInt }},
    { $project: { ...projectionObj, _id: 0, passwordHash: 0, __v: 0 }}
  ]).catch(err => {
    throw new HttpError('Error occurred while fetching sellers', { cause: err })
  })

  res.status(200).json({ total: resSellers.length, results: resSellers })
}


export async function getSellerById(req: Request, res: Response) {
  let { sellerId } = req.params

  if (sellerId === '@me')
    sellerId = req.__userAuth.id

  const user = await Seller.findById(sellerId, { _id: 0, passwordHash: 0 })
    .catch(err => {
      throw new HttpError("Error occurred while fetching seller's details", { cause: err })
    })

  if (!user)
    throw new HttpError('Seller not found', { statusCode: 404 })

  res.status(200).json(user)
}


export async function updateSeller(req: Request, res: Response) {
  let { sellerId } = req.params

  if (sellerId === '@me')
    sellerId = req.__userAuth.id

  await Seller.findByIdAndUpdate(
    sellerId, req.body, { runValidators: true, new: true }
  ).catch(err => {
    throw new HttpError('Error occurred while updating seller', { cause: err })
  })

  res.status(204)
}


export async function deleteSeller(req: Request, res: Response) {
  await deleteCustomer(req, res)
    .catch(err => {
      throw new HttpError('Error occurred while deleting the seller', { cause: err })
    })
}


// export async function changeSellerPassword(req: Request, res: Response) {
//   const { oldPasswordHash, newPasswordHash } = req.body
//   const seller = await Seller.findById(req.params.sellerId)
//   if (!seller)
//     throw new HttpError('Seller not found', { statusCode: 404 })

//   if (seller.passwordHash !== oldPasswordHash)
//     throw new HttpError(
//       'old password is not matching with the current password', { statusCode: 401 }
//     )

//   const updatedSeller = await seller.updateOne(
//     { passwordHash: newPasswordHash }, { runValidators: true, new: true }
//   ).catch(err => {
//     throw new HttpError('Error occurred while updating password', { cause: err })
//   })

//   await updateTokensInCookies(req, res, updatedSeller)
//   res.sendStatus(204)
// }


export async function blockSeller(req: Request, res: Response) {
  let { sellerId } = req.params

  if (sellerId === '@me')
    sellerId = req.__userAuth.id

  await Seller.findByIdAndUpdate(sellerId, { blocked: true }, { runValidators: true })
    .catch(err => {
      throw new HttpError('Error occurred while blocking the seller', { cause: err })
    })
  res.sendStatus(204)
}


export async function unblockSeller(req: Request, res: Response) {
  let { sellerId } = req.params

  if (sellerId === '@me')
    sellerId = req.__userAuth.id

  await Seller.findByIdAndUpdate(
    sellerId, { blocked: false }, { runValidators: true }
  ).catch(err => {
      throw new HttpError('Error occurred while unblocking the seller', { cause: err })
    })
  res.sendStatus(204)
}


export async function registerBook(req: Request, res: Response) {
  await addBook(req, res)
    .catch(err => {
      throw new HttpError('Error occurred while registering book', { cause: err })
    })
}


export async function getSalesAnalytics(req: Request, res: Response) {
  const booksInStock = await Book.find({ seller: req.__userAuth.id })
  const booksSold = await BookArchive.find({ seller: req.__userAuth.id })

  res.status(200).json({ booksInStock, booksSold })
}
