import { Types } from 'mongoose'
import { Request, Response } from 'express'
import { Cart } from '../models/Cart.ts'
import { Order, PaymentMethod } from '../models/Order.ts'
import { Book } from '../models/Book.ts'


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
  try {
    const cart = await Cart.find({ user: req.params.userid })

    if (!cart) {
      res.status(404).json({ message: 'Cart has no items' })
      return
    }

    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}


export async function addBookToCart(req: Request, res: Response) {
  const bookId = req.body.bookId

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: req.__userAuth.id },
      { $addToSet: { books: bookId } },
      { new: true, upsert: true }
    )

    if (!updatedCart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    await updatedCart.save()

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: `Error adding book ${bookId} to cart` })
  }
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
  const bookId = req.body.bookId

  try {
    const deletedCart = await Cart.findOneAndUpdate(
      { user: req.params.userid }, { $pull: { books: bookId } }, { new: true }
    )

    if (!deletedCart) {
      res.status(404).json({ message: 'cart not found' })
      return
    }

    await deletedCart.save()

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: `Error adding book ${bookId} to cart` })
  }
}


export async function checkout(req: Request, res: Response) {
  const { address, paymentMethod }: cartPurchaseFormData = req.body
  const userId = req.params.userid

  try {
    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
      res.status(404).json({ message: 'Cart is empty' })
      return
    }

    const currentDate = new Date()
    const deliveredByDate = new Date(
      currentDate.getTime() + getRandInt(1, 7) * (24*60*60) // Delivery time: 1-7 days (random)
    )

    const order = new Order({
      user: userId,
      books: cart.books,
      address: address,
      paymentMethod: paymentMethod,
      orderTime: currentDate,
      deliveredBy: deliveredByDate
    })

    order.save()
      .then(async () => {
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
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured during checkout' })
      })

  } catch (error) {
    res.status(500).json({ message: `Error in processing the purchase.`, err: (error as Error).message })
  }
}


export async function clearCart(req: Request, res: Response) {
  try {
    const deletedCart = await Cart.findOneAndDelete({ user: req.params.userid })
    if (!deletedCart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: `Error deleting cart` })
  }
}
