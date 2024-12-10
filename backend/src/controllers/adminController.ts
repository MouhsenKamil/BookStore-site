import { Request, Response } from "express"
import { Book } from "../models/Book"
import { Order } from "../models/Order"
import { Customer } from "../models/Customer"
import { Seller } from "../models/Seller"
import { BookArchive } from "../models/BooksArchive"


export async function getSiteAnalytics(req: Request, res: Response) {
  const totalCustomers = await Customer.countDocuments()
  const totalSellers = await Seller.countDocuments()

  const totalBooks = await Book.countDocuments({ unitsInStock: { $gt: 0 } })
  const totalBooksSold = await BookArchive.countDocuments()

  const totalOrders = {
    packaging: await Order.countDocuments({ status: 'packaging' }),
    onDelivery: await Order.countDocuments({ status: 'on_delivery' }),
    delivered: await Order.countDocuments({ status: 'delivered' }),
    cancelled: await Order.countDocuments({ status: 'cancelled' }),
    aborted: await Order.countDocuments({ status: 'aborted' }),
  }

  res.status(200).json({
    totalSellers, totalCustomers, totalBooks, totalBooksSold, totalOrders
  })
}
