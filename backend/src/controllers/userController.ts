// Also known as customerController.ts

import { Request, Response } from 'express'
import { Customer } from '../models/Customer.ts'
import { blockUserUtil, createUserUtil, unblockUserUtil } from '../utils/userUtils.ts'


export async function getUsers(req: Request, res: Response) {
  const { query } = req.query
  const query_obj = query ? { name: { $regex: query, options: 'i' }}: {}

  try {
    const users = await Customer.find(query_obj)
    if (!users) {
      res.status(404).json({ message: 'No users are found' })
      return
    }

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' })
  }
}


export async function getUserById(req: Request, res: Response) {
  const { userid } = req.params

  try {
    const user = await Customer.findById(userid)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Error in fetching user's details" })
  }
}


export async function createUser(req: Request, res: Response) {
  createUserUtil(req, res).then(user => {
      res.status(201).json({ userId: user?._id })
    })
    .catch(err => {
      if (err !== 409 || err != 422)
        res.status(500).json({ message: 'Error in registering user' })
    })
}


export async function updateUser(req: Request, res: Response) {
  const { userid } = req.params
  
  try {
    await Customer.findByIdAndUpdate(
      userid, req.body, { runValidators: true, new: true }
    )

    res.status(200).json({ message: 'Successfully updated user' })
  } catch (error) {
    res.status(500).json({ message: 'Error in updating user' })
  }
}


export async function changePassword(req: Request, res: Response) {
  const { oldPasswordHash, newPasswordHash } = req.body
  const { userid } = req.params

  try {
    const userObj = await Customer.findById(userid)

    if (!userObj) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (userObj.passwordHash !== oldPasswordHash) {
      res.status(401).json({ message: 'old password is not matching with the current password' })
      return
    }

    const updatedUser = await userObj.updateOne(
      { passwordHash: newPasswordHash }, { runValidators: true, new: true }
    )

    if (!updatedUser) {
      res.status(500).json({ message: 'Error in updating user' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error in updating password' })
  }
}


export async function deleteUser(req: Request, res: Response) {
  const { userid } = req.params

  try {
    const deletedUser = await Customer.findByIdAndDelete(userid)
    if (!deletedUser) {
      res.status(500).json({ message: 'Error in deleting user' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'Error in deleting user' })
  }
}


export async function blockUser(req: Request, res: Response) {
  await blockUserUtil(req, res)
}


export async function unblockUser(req: Request, res: Response) {
  await unblockUserUtil(req, res)
}
