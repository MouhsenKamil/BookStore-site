import { Request, Response } from "express"
import bcrypt from 'bcryptjs'

import { User, UserType } from "../models/User"
// import { Customer } from "../models/Customer.ts"
import { logEvents } from "../middlewares/logger.ts"
import { NewUserError } from "./exceptions.ts"

// import { BookDoc } from "../models/Book"
// import { WishlistDoc } from "../models/Wishlist.tsx"
// import { CartDoc } from "../models/Cart.ts"
// import { OrderDoc } from "../models/Order.ts"


export async function createUserUtil(req: Request, res: Response) {
  const userExists = await User.findOne({ email: req.body.email })

  if (userExists)
    throw new NewUserError('User already exists', {
      statusCode: 409,
      debugMsg: "Tried to create a user with pre-existing user's email id"
    })

  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  req.body.passwordHash = hashedPassword
  delete req.body.password

  // if (!req.body.type || req.body.type !== UserType.CUSTOMER)
  //   throw new NewUserError(
  //     !req.body.type ? 'User type is required' : `Unknown type: ${req.body.type}`,
  //     { statusCode: 422 }
  //   )

  let newUser = new User(req.body)
  await newUser.save()
  await logEvents(`New user account created: ${newUser._id}`)
  return newUser
}

// interface BookDocWithId {
//   mongoDoc: BookDoc
//   userIdField: 'seller'
// }

// interface WishlistDocWithId {
//   mongoDoc: WishlistDoc
//   userIdField: 'user'
// }

// interface CartDocWithId extends WishlistDocWithId {
//   mongoDoc: CartDoc
// }

// interface OrderDocWithId extends WishlistDocWithId {
//   mongoDoc: OrderDoc
// }

// type expandUserIdForeignKeyProps = (
//   BookDocWithId | WishlistDocWithId | CartDocWithId | OrderDocWithId
// )


// async function expandUserIdForeignKey(props: expandUserIdForeignKeyProps) {
//   const { mongoDoc, userIdField } = props

//   let userId

//   if (userIdField === 'seller' && 'seller' in mongoDoc)
//     userId = mongoDoc[userIdField]

//   else if (userIdField === 'user' && 'user' in mongoDoc)
//     userId = mongoDoc[userIdField]

//   else
//     throw new Error(`Unknown field: ${userIdField}`)

//   const referredUserObj = await User.findById(userId)
//   if (!referredUserObj)
//     throw new Error("Document referring to an unknown user")

//   return referredUserObj
// }
