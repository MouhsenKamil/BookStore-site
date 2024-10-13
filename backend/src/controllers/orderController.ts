import { Request, Response } from 'express'
import { Order, OrderStatus } from '../models/Order.ts'
import { Book } from '../models/Book.ts'


export async function getOrdersOfUser(req: Request, res: Response) {
  try {
    const orders = await Order.find({ user: req.params.userid })

    if (!orders) {
      res.status(404).json({ message: "User haven't ordered anything yet" })
      return
    }

    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' })
  }
}


export async function getOrderById(req: Request, res: Response) {

  try {
    const order = await Order.findById(req.params.orderid)
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Error in fetching order' })
  }
}


export async function updateOrderStatus(req: Request, res: Response) {
  const { status } = req.body

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderid, { status: status }, { new: true, runValidators: true }
    )

    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    if (updatedOrder.status !== OrderStatus.DELIVERED) {
      res.sendStatus(204)
      return
    }

    updatedOrder.books.forEach(async (book) => {
      const originalBookObj = await Book.findById(book.id)
      if (!originalBookObj || originalBookObj.unitsInStock !== 0) return

      originalBookObj.deleteOne()
        .catch(() => {
          res.status(500).json({ message: 'Error in removing sold out book' })
        })
    })

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error in updating order' })
  }
}


export async function deleteOrder(req: Request, res: Response) {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderid)
    if (!deletedOrder) {
      res.status(404).json({ message: 'Order not found' })
      return
    }
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order' })
  }
}


export async function cancelOrder(req: Request, res: Response) {
  req.body.status = OrderStatus.CANCELLED
  await updateOrderStatus(req, res)
}
