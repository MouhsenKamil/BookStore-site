import { Request, Response } from "express"
import bcrypt from 'bcryptjs'

import { User, UserType } from "../models/User"
import { Customer } from "../models/Customer"


export async function createUserUtil(req: Request, res: Response) {
  const userExists = await User.findOne({ email: req.body.email })

  if (userExists) {
    res.send(409).json({ message: 'User already exists' })
    throw 409
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  req.body.password_hash = hashedPassword
  delete req.body.password

  if (req.body.type !== UserType.CUSTOMER) {
    res.status(422).json({ message: `Unknown type: ${req.body.type}` })
    throw 422
  }

  let newUser = new Customer(req.body)
  await newUser.save()

  return newUser
}

export async function blockUserUtil(req: Request, res: Response) {
  const { userid } = req.params

  User.findByIdAndUpdate(
    userid, { $set: { is_blocked: true } }, { runValidators: true }
  )
    .then(() => {
      res.sendStatus(204)
    })
    .catch(err => {
      res.status(500).json({ message: 'Error in blocking the user' })
    })
}


export async function unblockUserUtil(req: Request, res: Response) {
  const { userid } = req.params

  User.findByIdAndUpdate(
    userid, { $set: { is_blocked: false } }, { runValidators: true }
  )
    .then(() => {
      res.sendStatus(204)
    })
    .catch(err => {
      res.status(500).json({ message: 'Error in unblocking the user' })
    })
}
