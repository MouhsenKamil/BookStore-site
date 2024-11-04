import { Request, Response } from 'express'
import { Wishlist } from '../models/Wishlist.ts'
import { HttpError } from '../utils/exceptions.ts'


export async function getWishlistOfUser(req: Request, res: Response) {
  const { userid } = req.params
  const wishlist = await Wishlist.find({ user: userid })
    .catch(err => {
      throw new HttpError('Error while fetching wishlist', { cause: err })
    })

  if (!wishlist)
    throw new HttpError('Wishlist is empty', { statusCode: 404 })

  res.status(201).json(wishlist)
}


export async function addBookToWishlist(req: Request, res: Response) {
  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { user: req.params.userId },
    { $addToSet: { books: req.body.bookId } },
    { new: true, upsert: true }
  )

  if (!updatedWishlist)
    throw new HttpError('Wishlist not found', { statusCode: 404 })

  await updatedWishlist.save()
    .catch(err => {
      throw new HttpError('Error while adding book to wishlist', { cause: err })
    })

  res.status(201).json({ message: 'Book has been added to wishlist' })
}


export async function deleteBookInWishlist(req: Request, res: Response) {
  const deletedWishlist = await Wishlist.findOneAndUpdate(
    { user: req.params.userId },
    { $pull: { books: req.body.bookId } },
    { new: true, upsert: true }
  )

  if (!deletedWishlist)
    throw new HttpError('Wishlist not found', { statusCode: 404 })

  await deletedWishlist.save()
    .catch(err => {
      throw new HttpError('Error while adding book to wishlist', { cause: err })
    })

  res.sendStatus(204)
}


export async function clearWishlist(req: Request, res: Response) {
  const deletedWishlist = await Wishlist.findOneAndDelete({ user: req.params.userId })
    .catch(err => {
      throw new HttpError('Error while clearing wishlist', { cause: err })
    })

  if (!deletedWishlist)
    throw new HttpError('Wishlist is already empty', { statusCode: 404 })

  res.sendStatus(204)
}
