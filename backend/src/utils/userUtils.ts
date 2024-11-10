// import { Request, Response } from "express"
// import bcrypt from 'bcryptjs'

// import { NewUserError } from "./exceptions.ts"
// import { logEvents } from "../middlewares/logger.ts"
// import { UserType } from "../models/User.ts"
// import { Customer } from "../models/Customer.ts"
// import { Seller } from "../models/Seller.ts"
// import { Admin } from "../models/Admin.ts"


// const UserTypeModelMap = {
//   customer: Customer,
//   seller: Seller,
//   admin: Admin
// }


// export async function createUserUtil(req: Request, res: Response) {
//   const userExists = await Customer.findOne({ email: req.body.email })

//   if (userExists)
//     throw new NewUserError('User already exists', {
//       statusCode: 409,
//       debugMsg: "Tried to create a user with pre-existing user's email id"
//     })

//   const hashedPassword = await bcrypt.hash(req.body.password, 12)
//   req.body.passwordHash = hashedPassword
//   delete req.body.password

//   let newUser = new Customer(req.body)
//   await newUser.save()
//   logEvents(`New user account created: ${newUser._id}`)
//   return newUser
// }


