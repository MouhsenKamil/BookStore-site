import { Request, Response } from 'express'
// import bcrypt from 'bcryptjs'

// import { Seller } from '../models/Seller.ts'
// import { UserType } from '../models/User.ts'

import { addBook } from './bookController.ts'
// import { blockUser, getUsers, unblockUser } from './userController.ts'
import { HttpError } from '../utils/exceptions.ts'


// export async function createSeller(req: Request, res: Response) {
//   const sellerExists = await Seller.findOne({ email: req.body.email })

//   if (sellerExists)
//     throw new HttpError('Seller already exists', { statusCode: 409 })

//   const hashedPassword = await bcrypt.hash(req.body.password, 12)
//   req.body.password_hash = hashedPassword
//   delete req.body.password

//   if (req.body.type !== UserType.SELLER)
//     throw new HttpError(`Unknown type: ${req.body.type}`, { statusCode: 422 })

//   let newSeller = new Seller(req.body)
//   await newSeller.save()
//     .catch(err => {
//       throw new HttpError('Error while adding seller', { cause: err })
//     })

//   res.status(201).json(newSeller)
// }


// export async function getSellers(req: Request, res: Response) {
//   // const { query, limit } = req.query
//   // const query_obj = query ? { name: { $regex: query, $options: 'i' } } : {}
//   // const sellers = await Seller.find(query_obj).limit()
//   //   .catch(err => {
//   //     throw new HttpError('Error while fetching sellers', { cause: err })
//   //   })
//   // res.status(200).json(sellers)

//   await getUsers(req, res).catch(err => {
//     if (err.message !== 'Error while fetching users')
//       throw err
//     throw new HttpError('Error while fetching sellers', { cause: err.cause })
//   })

// }


// export async function getSellerById(req: Request, res: Response) {
//   const { sellerId } = req.params
//   const seller = await Seller.findById(sellerId)
//     // .catch(err => {
//     //   throw new HttpError('Error while fetching seller', { cause: err })
//     // })

//   if (!seller)
//     throw new HttpError('Seller not found', { statusCode: 404 })

//   res.status(200).json(seller)
// }


// export async function updateSeller(req: Request, res: Response) {
//   const { sellerId } = req.params
//   const updatedSeller = await Seller.findByIdAndUpdate(
//     sellerId, req.body, { runValidators: true, new: true }
//    )
//   //  .catch(err => {
//   //   throw new HttpError('Error updating seller', { cause: err })
//   //  })

//   if (!updatedSeller)
//     throw new HttpError('Seller not found', { statusCode: 404 })

//   res.sendStatus(204)
// }


// export async function deleteSeller(req: Request, res: Response) {
//   const { sellerId } = req.params
//   const deletedSeller = await Seller.findByIdAndDelete(sellerId)
//   //  .catch(err => {
//   //   throw new HttpError('Error updating seller', { cause: err })
//   //  })

//   if (!deletedSeller)
//     throw new HttpError('Seller not found', { statusCode: 404 })

//   res.sendStatus(204)
// }


// export async function blockSeller(req: Request, res: Response) {
//   req.params.userId = req.params.sellerId
//   await blockUser(req, res)
// }


// export async function unblockSeller(req: Request, res: Response) {
//   req.params.userId = req.params.sellerId
//   await unblockUser(req, res)
// }


export async function registerBook(req: Request, res: Response) {
  await addBook(req, res)
    .catch(err => {
      throw new HttpError('Error while registering book', { cause: err })
    })
}


export async function getSalesAnalytics(req: Request, res: Response) {

}

// export async function changePassword(req: Request, res: Response) {
//   const { oldPasswordHash, newPasswordHash } = req.body
//   const { sellerId } = req.params

//   const sellerObj = await Seller.findById(sellerId)

//   if (!sellerObj)
//     throw new HttpError('Seller not found', { statusCode: 404 })

//   if (sellerObj.passwordHash !== oldPasswordHash)
//     throw new HttpError('old password is not matching with the current password', { statusCode: 401 })

//   const updatedSeller = await sellerObj.updateOne(
//     { passwordHash: newPasswordHash }, { runValidators: true, new: true }
//   )
//   // .catch(err => {
//   //   throw new HttpError('Error in updating password', { cause: err })
//   // })

//   if (!updatedSeller)
//     throw new HttpError('Error while updating password')

//   res.sendStatus(204)
// }
