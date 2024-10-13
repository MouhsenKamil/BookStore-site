import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { User, UserDoc } from '../models/User.ts'
import { UserAuthData } from '../middlewares/authMiddleware.ts'
import { createUserUtil } from '../utils/userUtils.ts'


function getAccessToken(user: UserDoc) {
  return jwt.sign(
    {
      id: user._id,
      type: user.type,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '15m' }
  )
}


function getRefreshToken(user: UserDoc) {
  const client_id = bcrypt.hash(
    JSON.stringify({
      name: user.name,
      email: user.email,
      password: user.passwordHash
    }),
    process.env.CLIENT_ID_SECRET as string,
  )

  return jwt.sign(
    {
      id: user._id,
      client_id
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '7d' },
  )
}


export async function register(req: Request, res: Response) {
  try {
    createUserUtil(req, res)
      .then(newUser => {
        const accessToken = getAccessToken(newUser)
        res.status(201).json({ result: newUser, token: accessToken })
      })
      .catch(err => {
        if (err != 409 || err != 422)
          res.status(500).json({ message: 'Error in registering user' })
      })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}


export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    // Validate username and password
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const accessToken = getAccessToken(user)
    const refreshToken = getRefreshToken(user)

    // Create secure cookie with refresh token 
    res.cookie(process.env.JWT_TOKEN_COOKIE_NAME as string, refreshToken, {
      httpOnly: true, //accessible only by web server 
      secure: true, //https
      maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry: 7 days
    })

    // Send accessToken containing username and roles 
    res.status(200).json({ accessToken })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}


export function refresh(req: Request, res: Response) {
  const cookies = req.cookies
  const refreshToken: string = cookies[process.env.JWT_TOKEN_COOKIE_NAME as string]

  if (!refreshToken) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err, decoded) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }

      const _decoded = decoded as UserAuthData
      const user = await User.findById(_decoded.id)

      if (!user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const accessToken = getAccessToken(user)
      res.status(200).json({ accessToken })
    }
  )
}


export function logout(req: Request, res: Response) {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    res.sendStatus(204)
    return
  }

  res.clearCookie(
    process.env.JWT_TOKEN_COOKIE_NAME as string,
    { httpOnly: true, secure: true }
  )
  res.json({ message: 'Cookie cleared' })
}