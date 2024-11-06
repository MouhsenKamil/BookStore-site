import { Request, Response } from 'express'
import { Order, OrderStatus } from '../models/Order.ts'
import { Book } from '../models/Book.ts'
import { HttpError } from '../utils/exceptions.ts'
import { BookArchive } from '../models/BooksArchive.ts'


export async function getOrdersOfUser(req: Request, res: Response) {
  const orders = await Order.find({ user: req.params.userId })
    .catch((err) => {
      throw new HttpError('Error while fetching order', { cause: err })
    })

  if (!orders)
    throw new HttpError("User haven't ordered anything yet", { statusCode: 404 })

  res.status(200).json(orders)
}


export async function getOrderById(req: Request, res: Response) {
  const order = await Order.findById(req.params.orderId)
    .catch((err) => {
      throw new HttpError('Error while fetching order', { cause: err })
    })

  if (!order)
    throw new HttpError('Order not found', { statusCode: 404 })

  res.status(200).json(order)
}


export async function updateOrderStatus(req: Request, res: Response) {
  const { status } = req.body
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.orderId, { status: status }, { new: true, runValidators: true }
  )
  .catch((err) => {
    throw new HttpError('Error while updating order', { cause: err })
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
        throw new HttpError('Error while removing sold out book', { cause: err })
      })
  })

  res.sendStatus(204)
}


export async function cancelOrder(req: Request, res: Response) {
  const cancelledOrder = await Order.findById(req.params.orderId)
    .catch(err => {
      throw new HttpError('Error while cancelling order', { cause: err })
    })

  if (!cancelledOrder)
    throw new HttpError('Order not found', { statusCode: 404 })

  if (cancelledOrder.status === OrderStatus.DELIVERED)
    throw new HttpError(
      "Cannot cancel an order that's already delivered", { statusCode: 406 }
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
