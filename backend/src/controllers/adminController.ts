import { Request, Response } from "express"
import { Book } from "../models/Book"
import { Order } from "../models/Order"
import { Customer } from "../models/Customer"
import { Seller } from "../models/Seller"


export async function getSiteAnalytics(req: Request, res: Response) {
  const totalCustomers = await Customer.countDocuments()
  const totalSellers = await Seller.countDocuments()

  const totalBooks = await Book.countDocuments({ unitsInStock: { $gt: 0 } })
  const totalOrders = await Order.countDocuments()

  res.status(200).json({
    totalUsers: totalCustomers, totalSellers, totalCustomers, totalBooks, totalOrders
  })
}
