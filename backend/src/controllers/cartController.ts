import { Types } from 'mongoose'
import { Request, Response } from 'express'
import { Cart } from '../models/Cart.ts'
import { Order, PaymentMethod } from '../models/Order.ts'
import { Book } from '../models/Book.ts'
import { HttpError } from '../utils/exceptions.ts'


interface cartPurchaseFormData {
  userId: Types.ObjectId
  cartId: Types.ObjectId
  address: string
  paymentMethod: PaymentMethod
}

function getRandInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}


export async function getCartOfUser(req: Request, res: Response) {
  const { userId } = req.params
  const cart = await Cart.find({ user: userId })
    .catch(err => {
      throw new HttpError(`Error while fetching cart`, { cause: err })
    })

  if (!cart)
    throw new HttpError('Cart has no items', { statusCode: 404 })

  res.status(200).json(cart)
}


export async function addBookToCart(req: Request, res: Response) {
  const bookId = req.body.bookId

  const updatedCart = await Cart.findOneAndUpdate(
    { user: req.__userAuth.id },
    { $addToSet: { books: bookId } },
    { new: true, upsert: true }
  )

  if (!updatedCart)
    throw new HttpError('Cart not found', { statusCode: 404 })

  await updatedCart.save()
    .catch(err => {
      throw new HttpError(`Error while adding book to cart`, { cause: err })
    })
  res.sendStatus(204)
}


// export async function getCartById(req: Request, res: Response) {
//   try {
//     const { id } = req.params
//     const cart = await Cart.findById(id)

//     if (!cart) {
//       res.status(404).json({ message: 'Cart not found' })
//       return
//     }

//     res.status(201).json(cart)
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' })
//   }
// }


export async function deleteBookInCart(req: Request, res: Response) {
  const { bookId } = req.body
  const { userId } = req.params
  const deletedCart = await Cart.findOneAndUpdate(
    { user: userId }, { $pull: { books: { id: bookId } } }, { new: true }
  )

  if (!deletedCart)
    throw new HttpError('Cart not found', { statusCode: 404 })

  await deletedCart.save()
    .catch(err => {
      throw new HttpError(`Error while deleting book from cart`, { cause: err })
    })

  res.sendStatus(204)
}


export async function checkout(req: Request, res: Response) {
  const { address, paymentMethod }: cartPurchaseFormData = req.body
  const { userId } = req.params

  const cart = await Cart.findOne({ user: userId })
  if (!cart)
    throw new HttpError('Cart is empty', { statussCode: 404 })

  const currentDate = new Date()
  const deliveredByDate = new Date(
    currentDate.getTime() + getRandInt(1, 7) * (24 * 60 * 60) // Delivery time: 1-7 days (random)
  )

  const order = new Order({
    user: userId,
    books: cart.books,
    address: address,
    paymentMethod: paymentMethod,
    orderTime: currentDate,
    deliveredBy: deliveredByDate
  })

  await order.save()
    .catch(err => {
      throw new HttpError('Error while processing checkout', { cause: err })
    })

  cart.books.forEach(async (book) => {
    const originalBookObj = await Book.findById(book.id)
    if (!originalBookObj) return

    const remaining_books_in_stock = originalBookObj.unitsInStock - book.quantity
    await originalBookObj.updateOne({ $inc: { units_in_stock: -remaining_books_in_stock } })
  })

  await cart.deleteOne()

  res.status(201).json({
    message: 'Order has been created successfully.',
    order_id: order._id,
    deliveredBy: deliveredByDate
  })

  // throw new HttpError(`Error in processing the purchase.`, { cause: err })
}


export async function clearCart(req: Request, res: Response) {
  const deletedCart = await Cart.findOneAndDelete({ user: req.params.userId })
    .catch(err => {
      throw new HttpError('Error while deleting cart', { cause: err })
    })

  if (!deletedCart)
    throw new HttpError('Cart not found', { statusCode: 404 })

  res.sendStatus(204)
}
