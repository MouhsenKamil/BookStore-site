import mongoose from 'mongoose'
import { Request, Response } from 'express'

import { Cart } from '../models/Cart.ts'
import { ICheckoutFormData, Order } from '../models/Order.ts'
import { Book } from '../models/Book.ts'
import { HttpError } from '../utils/exceptions.ts'
import { BookArchive } from '../models/BooksArchive.ts'
import { getRandInt } from '../utils/funcUtils.ts'
import { mergeBooksByQuantity } from '../utils/orderUtils.ts'


const _7_DAYS = 24 * 60 * 60 * 1000


export async function updatedCart(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId }, { books: req.body.books }, { new: true, upsert: true }
  )

  res.sendStatus(204)
}

export async function getCartOfUser(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const cart = await Cart.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    { $unwind: '$books' },
    {
      $lookup: {
        from: 'books',
        localField: 'books.id',
        foreignField: '_id',
        as: 'bookDetails'
      }
    },
    { $unwind: '$bookDetails' },
    {
      $project: {
        _id: 0,
        books: {
          _id: "$bookDetails._id",
          quantity: 1,
          price: "$bookDetails.price",
          title: "$bookDetails.title",
          coverImage: "$bookDetails.coverImage",
          unitsInStock: "$bookDetails.unitsInStock"
        },
      }
    },
    {
      $group: {
        _id: null,
        books: {
          $push: {
            _id: "$books._id",
            quantity: "$books.quantity",
            price: "$books.price",
            title: "$books.title",
            coverImage: "$books.coverImage",
            unitsInStock: "$books.unitsInStock"
          }
        }
      }
    },
  ])
    .catch(err => {
      throw new HttpError(`Error occurred while fetching cart`, { cause: err })
    })

  // if (!cart)
  //   throw new HttpError('Cart is empty', { statusCode: 404 })

  res.status(200).json(cart[0]?.books || [])
}


export async function addBookToCart(req: Request, res: Response) {
  const { bookId, quantity } = req.body

  let updatedCart = await Cart.findOneAndUpdate(
    { user: req.__userAuth.id, "books.id": bookId },
    { $inc: { "books.$.quantity": quantity }},
    { new: true },
  )

  if (!updatedCart)
    updatedCart = await Cart.findOneAndUpdate(
      { user: req.__userAuth.id },
      { $addToSet: { books: { id: bookId, quantity }}},
      { new: true, upsert: true }
    )

  if (!updatedCart)
    throw new HttpError('Cart not found', { statusCode: 404 })
  
  await updatedCart.save()
    .catch(err => {
      throw new HttpError(`Error occurred while adding book to cart`, { cause: err })
    })

  res.sendStatus(204)
}


export async function deleteBookInCart(req: Request, res: Response) {
  const { bookId } = req.body
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { books: { id: bookId }}},
    { new: true }
  )

  if (!updatedCart)
    throw new HttpError('Cart not found', { statusCode: 404 })

  await updatedCart.save()
    .catch(err => {
      throw new HttpError(`Error occurred while deleting book from cart`, { cause: err })
    })

  res.sendStatus(204)
}


export async function checkout(req: Request, res: Response) {
  const checkoutProps: ICheckoutFormData = req.body
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const cart = await Cart.findOne({ user: userId })
  if (!cart)
    throw new HttpError('Cart is empty', { statusCode: 404 })

  const currentDate = new Date()
  const deliveredByDate = new Date(
    currentDate.getTime() + getRandInt(1, 7) * _7_DAYS
  )

  const order = new Order({
    user: userId,
    books: mergeBooksByQuantity(cart.books),
    orderTime: currentDate,
    deliveredBy: deliveredByDate,
    ...checkoutProps
  })

  await order.save()
    .catch(err => {
      throw new HttpError('Error occurred while processing checkout', { cause: err })
    })

  cart.books.forEach(async (book) => {
    const originalBookObj = await Book.findById(book.id)
    if (!originalBookObj)
      return

    // Pass the purchased books to archive
    const archiveCopy = new BookArchive(originalBookObj.toJSON())

    // Update the original book
    await originalBookObj.updateOne({ $inc: { units_in_stock: -book.quantity } })

    // Set the available quantity in it with the purchased quantity
    await archiveCopy.updateOne({ $inc: { units_in_stock: book.quantity } })
  })

  await cart.deleteOne()

  res.status(201).json({
    message: 'Order has been created successfully.',
    orderId: order._id,
    deliveredBy: deliveredByDate
  })
}


export async function clearCart(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const deletedCart = await Cart.findOneAndDelete({ user: userId })
    .catch(err => {
      throw new HttpError('Error occurred while deleting cart', { cause: err })
    })

  if (!deletedCart)
    throw new HttpError('Cart not found', { statusCode: 404 })

  res.sendStatus(204)
}
