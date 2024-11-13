import { Request, Response } from 'express'
import { Cart } from '../models/Cart.ts'
import { Order, PaymentMethod } from '../models/Order.ts'
import { Book } from '../models/Book.ts'
import { HttpError } from '../utils/exceptions.ts'
import { BookArchive } from '../models/BooksArchive.ts'
import { getRandInt } from '../utils/funcUtils.ts'


interface cartPurchaseFormData {
  homeNo: string
  street: string
  pinCode: number
  city: string
  state: string
  country: string
  phoneNo: number
  paymentMethod: PaymentMethod
}


export async function getCartOfUser(req: Request, res: Response) {
  const { userId } = req.params

  const cart = await Cart.aggregate([
    {
      $match: { user: userId }
    },
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
        user: 0,
        "bookDetails.quantity": 1,
        "bookDetails.id": "bookDetails._id",
        "bookDetails.unitPrice": "bookDetails.price",
        "bookDetails.title": 1,
        "bookDetails.unitsInStock": 1,
        "bookDetails.coverImage": 1
      }
    },
    {
      $group: {
        books: {
          $push: {
            quantity: "$bookDetails.quantity",
            _id: "$bookDetails._id",
            title: "$bookDetails.title",
            price: "$bookDetails.price",
            unitsInStock: "$bookDetails.unitsInStock",
            coverImage: "$bookDetails.coverImage",
          }
        }
      }
    },
    {
      $project: {
        "bookDetails": 0
      }
    }
  ])
    .catch(err => {
      throw new HttpError(`Error occurred while fetching cart`, { cause: err })
    })

  if (!cart)
    throw new HttpError('Cart is empty', { statusCode: 404 })

  res.status(200).json(cart)
}


export async function addBookToCart(req: Request, res: Response) {
  const { bookId, quantity } = req.body

  const updatedCart = await Cart.findOneAndUpdate(
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
  const { userId } = req.params

  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId }, { $pull: { books: { id: bookId } } }, { new: true }
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
  const {
    homeNo, street, pinCode, city, state, country, phoneNo, paymentMethod
  }: cartPurchaseFormData = req.body
  const { userId } = req.params

  const cart = await Cart.findOne({ user: userId })
  if (!cart)
    throw new HttpError('Cart is empty', { statusCode: 404 })

  const currentDate = new Date()
  const deliveredByDate = new Date(
    currentDate.getTime() + getRandInt(1, 7) * (24 * 60 * 60) // Delivery time: 1-7 days (random)
  )

  const order = new Order({
    user: userId,
    books: cart.books,
    homeNo: homeNo,
    street: street,
    pinCode: pinCode,
    city: city,
    state: state,
    country: country,
    phoneNo: phoneNo,
    paymentMethod: paymentMethod,
    orderTime: currentDate,
    deliveredBy: deliveredByDate
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
    order_id: order._id,
    deliveredBy: deliveredByDate
  })
}


export async function clearCart(req: Request, res: Response) {
  const deletedCart = await Cart.findOneAndDelete({ user: req.params.userId })
    .catch(err => {
      throw new HttpError('Error occurred while deleting cart', { cause: err })
    })

  if (!deletedCart)
    throw new HttpError('Cart not found', { statusCode: 404 })

  res.sendStatus(204)
}
