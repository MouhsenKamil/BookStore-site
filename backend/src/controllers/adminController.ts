import { Request, Response } from "express"
import { User, UserType } from "../models/User"
import { Book } from "../models/Book"
import { Order } from "../models/Order"


export async function getSiteAnalytics(req: Request, res: Response) {
  const totalUsers = await User.countDocuments({ type: { $ne: UserType.ADMIN } })
  const totalSellers = await User.countDocuments({ type: UserType.SELLER })
  const totalCustomers = totalUsers - totalSellers

  const totalBooks = await Book.countDocuments({ unitsInStock: { $gt: 0 } })
  const totalOrders = await Order.countDocuments()

  res.status(200).json({
    totalUsers, totalSellers, totalCustomers, totalBooks, totalOrders
  })
}
