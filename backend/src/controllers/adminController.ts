import { Request, Response } from "express"
import { User, UserType } from "../models/User"


export async function getSiteAnalytics(req: Request, res: Response) {
  const totalUsers = await User.countDocuments({
    type: {
      $ne: UserType.ADMIN
    }
  })
  // group results by month of creation

  const totalSellers = await User.countDocuments({
    type: UserType.SELLER
  })

  const totalAdmins = totalUsers - totalSellers

  

  res.status(200).json({
    totalUsers, totalSellers, totalAdmins,
  })
}
