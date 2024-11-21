import { Request, Response } from 'express'
import { Wishlist } from '../models/Wishlist.ts'
import { HttpError } from '../utils/exceptions.ts'
import mongoose from 'mongoose'


export async function getWishlistOfUser(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const wishlist = await Wishlist.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) }
    },
    {
      $lookup: {
        from: "books",
        localField: "books",
        foreignField: "_id",
        as: "bookDetails"
      }
    },
    { $unwind: '$bookDetails' },
    {
      $project: {
        // _id: 1,
        "bookDetails._id": 1,
        "bookDetails.quantity": 1,
        "bookDetails.price": 1,
        "bookDetails.title": 1,
        "bookDetails.unitsInStock": 1,
        "bookDetails.coverImage": 1,
      }
    },
    {
      $group: {
        _id: null,
        books: {
          $push: {
            _id: "$bookDetails._id",
            quantity: "$bookDetails.quantity",
            title: "$bookDetails.title",
            price: "$bookDetails.price",
            unitsInStock: "$bookDetails.unitsInStock",
            coverImage: "$bookDetails.coverImage",
          }
        }
      }
    },
    {
      $project: {
        _id: 0, "bookDetails": 0
      }
    }
  ])
    .catch(err => {
      throw new HttpError('Error occurred while fetching wishlist', { cause: err })
    })

  res.status(201).json(wishlist[0])
}


export async function addBookToWishlist(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $addToSet: { books: req.body.bookId } },
    { new: true, upsert: true }
  )

  if (!updatedWishlist)
    throw new HttpError('Wishlist not found', { statusCode: 404 })

  await updatedWishlist.save()
    .catch(err => {
      throw new HttpError('Error occurred while adding book to wishlist', { cause: err })
    })

  res.status(201).json({ message: 'Book has been added to wishlist' })
}


export async function deleteBookInWishlist(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const deletedWishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { books: req.body.bookId } },
    { new: true, upsert: true }
  )

  if (!deletedWishlist)
    throw new HttpError('Wishlist not found', { statusCode: 404 })

  await deletedWishlist.save()
    .catch(err => {
      throw new HttpError('Error occurred while adding book to wishlist', { cause: err })
    })

  res.sendStatus(204)
}


export async function clearWishlist(req: Request, res: Response) {
  let { userId } = req.params

  if (userId === '@me')
    userId = req.__userAuth.id

  const deletedWishlist = await Wishlist.findOneAndDelete({ user: userId })
    .catch(err => {
      throw new HttpError('Error occurred while clearing wishlist', { cause: err })
    })

  if (!deletedWishlist)
    throw new HttpError('Wishlist is already empty', { statusCode: 404 })

  res.sendStatus(204)
}
