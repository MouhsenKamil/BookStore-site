import mongoose from 'mongoose'
import { Request, Response } from 'express'

import { Order, OrderStatus } from '../models/Order.ts'
import { Book } from '../models/Book.ts'
import { HttpError } from '../utils/exceptions.ts'
import { BookArchive } from '../models/BooksArchive.ts'


export async function getOrdersOfUser(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const orders = await Order.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    { $unwind: "$books" },
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
        _id: 1,
        books: {
          _id: "$bookDetails._id",
          quantity: 1,
          price: "$bookDetails.price",
          title: "$bookDetails.title",
          coverImage: "$bookDetails.coverImage",
        },
        orderTime: 1,
        deliveredBy: 1,
        status: 1,
        homeNo: 1,
        street: 1,
        pinCode: 1,
        city: 1,
        state: 1,
        country: 1,
        phoneNo: 1,
        paymentMethod: 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        books: {
          $push: {
            _id: "$books._id",
            quantity: "$books.quantity",
            price: "$books.price",
            title: "$books.title",
            coverImage: "$books.coverImage",
          },
        },
        orderTime: { $first: "$orderTime" },
        deliveredBy: { $first: "$deliveredBy" },
        status: { $first: "$status" },
        homeNo: { $first: "$homeNo" },
        street: { $first: "$street" },
        pinCode: { $first: "$pinCode" },
        city: { $first: "$city" },
        state: { $first: "$state" },
        country: { $first: "$country" },
        phoneNo: { $first: "$phoneNo" },
        paymentMethod: { $first: "$paymentMethod" },
      }
    }
  ])
    .catch((err) => {
      throw new HttpError('Error occurred while fetching order', { cause: err })
    })

  if (!orders)
    throw new HttpError("User haven't ordered anything yet", { statusCode: 404 })

  res.status(200).json(orders)
}


export async function getOrders(req: Request, res: Response) {
  const { limit = 10, fields = [], sort = 'name', order = 'asc' } = req.query
  const orderStr = (order as string).toLowerCase()

  if (!['asc', 'desc'].includes(orderStr))
    throw new HttpError(`Invalid value for sort order: ${order}`, { statusCode: 400 })

  const orderInt = (orderStr === 'asc') ? 1: -1
  const fieldsArr = fields as string[] // (fields as string).trim().split(',')

  let projectionObj: Record<string, 1 | 0> = Object.fromEntries(
    fieldsArr.map(elem => [elem, 1])
  )

  if (Object.keys(projectionObj).length === 0)
    projectionObj = { __v: 0 }

  projectionObj._id = projectionObj._id ?? 0

  const orders = await Order.find(
    {}, { limit: +limit }, { sort: { [sort as string]: orderInt } },
  )
  res.status(200).json(orders)
}


export async function getOrderById(req: Request, res: Response) {
  const order = await Order.findById(req.params.orderId, { _id: 0 })
    .catch((err) => {
      throw new HttpError('Error occurred while fetching order', { cause: err })
    })

  if (!order)
    throw new HttpError('Order not found', { statusCode: 404 })

  res.status(200).json(order)
}


export async function updateOrder(req: Request, res: Response) {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.orderId, req.body, { new: true, runValidators: true }
  )
  .catch((err) => {
    throw new HttpError('Error occurred while updating order', { cause: err })
  })

  if (!updatedOrder)
    throw new HttpError('Order not found', { statusCode: 404 })

  if (updatedOrder.status !== OrderStatus.DELIVERED) {
    res.sendStatus(204)
    return
  }

  updatedOrder.books.forEach(async (book) => {
    const originalBookObj = await Book.findById(book.id)
    if (!originalBookObj || originalBookObj.unitsInStock !== 0)
      return

    await originalBookObj.deleteOne()
      .catch(err => {
        throw new HttpError('Error occurred while removing sold out book', { cause: err })
      })
  })

  res.sendStatus(204)
}


export async function cancelOrder(req: Request, res: Response) {
  console.log('from cancel order: ', req.params.orderId)
  const cancelledOrder = await Order.findById(req.params.orderId)
    .catch(err => {
      throw new HttpError('Error occurred while cancelling order', { cause: err })
    })

  if (!cancelledOrder)
    throw new HttpError('Order not found', { statusCode: 404 })

  if (cancelledOrder.status === OrderStatus.DELIVERED)
    throw new HttpError(
      "Cannot cancel an order that's already delivered", { statusCode: 409 }
    )

  // Load the archive copies and move it back to the 'book' collection
  cancelledOrder.books.forEach(async (book) => {
    const originalBookObj = await Book.findById(book.id)
    await originalBookObj?.updateOne(
      { $inc: { units_in_stock: book.quantity } }
    )

    const archiveCopy = BookArchive.findById(book.id)
    await archiveCopy?.updateOne(
      { $inc: { units_in_stock: -book.quantity } }
    )
  })
  res.sendStatus(204)
}
