import { Request, Response } from 'express'
import { Wishlist } from '../models/Wishlist.ts'


export async function getWishlistOfUser(req: Request, res: Response) {
  const { userid } = req.params

  try {
    const wishlist = await Wishlist.find({ user: userid })

    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist is empty' })
      return
    }

    res.status(201).json(wishlist)
  } catch (error) {
    res.status(500).json({ message: 'Error in fetching wishlist' })
  }
}


export async function addBookToWishlist(req: Request, res: Response) {
  const { userid } = req.params

  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { user: userid },
      { $addToSet: { books: req.body.bookId } },
      { new: true, upsert: true }
    )

    if (!updatedWishlist) {
      res.status(404).json({ message: 'Wishlist not found' })
      return
    }

    await updatedWishlist.save()

    res.status(201).json({ message: 'Book has been added to wishlist' })
  } catch (error) {
    res.status(500).json({ message: 'Error adding book to wishlist' })
  }
}


export async function deleteBookInWishlist(req: Request, res: Response) {
  const { userid } = req.params

  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { user: userid },
      { $pull: { books: req.body.bookId } },
      { new: true, upsert: true }
    )

    if (!updatedWishlist) {
      res.status(404).json({ message: 'Wishlist not found' })
      return
    }

    await updatedWishlist.save()

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: `Error adding book to wishlist` })
  }
}


export async function clearWishlist(req: Request, res: Response) {
  const { userid } = req.params

  try {
    const deletedWishlist = await Wishlist.findOneAndDelete({ user: userid })
    if (!deletedWishlist) {
      res.status(404).json({ message: 'Wishlist is already empty' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error clearing wishlist' })
  }
}
