import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { Seller } from '../models/Seller.ts'
import { addBook } from './bookController.ts'
import { UserType } from '../models/User.ts'
import { blockUserUtil, unblockUserUtil } from '../utils/userUtils.ts'


export async function createSeller(req: Request, res: Response) {
  try {
    const sellerExists = await Seller.findOne({ email: req.body.email })

    if (sellerExists) {
      res.send(409).json({ message: 'Seller already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    req.body.password_hash = hashedPassword
    delete req.body.password

    if (req.body.type !== UserType.SELLER) {
      res.status(422).json({ message: `Unknown type: ${req.body.type}` })
      throw 422
    }

    let newSeller = new Seller(req.body)
    await newSeller.save()

    res.status(201).json(newSeller)
  } catch (error) {
    res.status(500).json({ message: 'Error adding seller' })
  }
}


export async function getSellers(req: Request, res: Response) {
  try {
    const { query } = req.query
    const query_obj = query ? { name: { $regex: query, $options: 'i' } } : {}
    const sellers = await Seller.find(query_obj)

    if (!sellers) {
      res.status(200).json({ message: `No results found for '${query}'` })
      return
    }

    res.status(200).json(sellers)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}


export async function getSellerById(req: Request, res: Response) {
  const { sellerid } = req.params

  try {
    const seller = await Seller.findById(sellerid)
    if (!seller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }

    res.status(200).json(seller)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller' })
  }
}


export async function updateSeller(req: Request, res: Response) {
  const { sellerid } = req.params

  try {
    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerid, req.body, { runValidators: true, new: true }
    )

    if (!updatedSeller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error updating seller' })
  }
}


export async function deleteSeller(req: Request, res: Response) {
  const { sellerid } = req.params

  try {
    const deletedSeller = await Seller.findByIdAndDelete(sellerid)
    if (!deletedSeller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error deleting seller' })
  }
}


export async function blockSeller(req: Request, res: Response) {
  await blockUserUtil(req, res)
}


export async function unblockSeller(req: Request, res: Response) {
  await unblockUserUtil(req, res)
}


export async function registerBook(req: Request, res: Response) {
  addBook(req, res)
    .catch(() => res.status(500).json(
      { message: 'Error registering book' }
    ))
}


export async function changePassword(req: Request, res: Response) {
  const { oldPasswordHash, newPasswordHash } = req.body
  const { sellerid } = req.params

  try {
    const sellerObj = await Seller.findById(sellerid)

    if (!sellerObj) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }

    if (sellerObj.passwordHash !== oldPasswordHash) {
      res.status(401).json({ message: 'old password is not matching with the current password' })
      return
    }

    const updatedUser = await sellerObj.updateOne(
      { passwordHash: newPasswordHash }, { runValidators: true, new: true }
    )

    if (!updatedUser) {
      res.status(500).json({ message: 'Error in updating seller' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error in updating password' })
  }
}