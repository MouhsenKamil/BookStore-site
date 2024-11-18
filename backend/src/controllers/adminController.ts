import { Request, Response } from "express"
import { Book } from "../models/Book"
import { Order } from "../models/Order"
import { Customer } from "../models/Customer"
import { Seller } from "../models/Seller"


export async function getSiteAnalytics(req: Request, res: Response) {
  const totalCustomers = await Customer.countDocuments()
  const totalSellers = await Seller.countDocuments()

  const totalBooks = await Book.find({ unitsInStock: { $gt: 0 } })
  const totalBooksSold = await Book.find({})
  const totalOrders = await Order.countDocuments()

  res.status(200).json({
    totalSellers, totalCustomers, totalBooks, totalBooksSold, totalOrders
  })
}
