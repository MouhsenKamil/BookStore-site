import { Request, Response } from "express"
import { UserDoc, UserType } from "../models/User"
import mongoose from "mongoose"

import bcrypt from 'bcryptjs'
import jwt, { TokenExpiredError } from 'jsonwebtoken'

import env from '../config/env.ts'
import { HttpError, ForceReLogin } from "./exceptions.ts"
import { Customer } from "../models/Customer.ts"
import { Seller } from "../models/Seller.ts"
import { Admin } from "../models/Admin.ts"


// Client ID token util
export async function getClientIdToken(user: UserDoc) {
  return await bcrypt.hash(
    JSON.stringify({
      name: user.name,
      email: user.email,
      type: user.type,
      passwordHash: user.passwordHash
    }),
    12,
  )
}


// Access Token utils
export interface AccessToken {
  id: string
  type: UserType
  passwordHash: string
}


export async function hashAccessToken(accessToken: string) {
  return await bcrypt.hash(accessToken, 12)
}


export async function getAccessToken(user: UserDoc) {
  return jwt.sign(
    {
      id: user._id,
      type: user.type,
      passwordHash: user.passwordHash
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
}


export function setAccessTokenToCookies(res: Response, accessToken: string) {
  const EXPIRE_IN_15_MINS =  15 * 60 * 1000
  const [header, payload, signature] = accessToken.split('.')

  res.cookie(env.ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME, `${header}.${payload}`, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "lax",
    maxAge: EXPIRE_IN_15_MINS
  })

  res.cookie(env.ACCESS_TOKEN_SIGN_COOKIE_NAME, signature, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "lax",
    maxAge: EXPIRE_IN_15_MINS
  })
}


export function clearAccessTokenFromCookies(res: Response) {
  res.clearCookie(env.ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "lax",
  })

  res.clearCookie(env.ACCESS_TOKEN_SIGN_COOKIE_NAME, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "lax",
  })
}


export async function verifyAccessToken(accessToken: string): Promise<AccessToken> {
  return new Promise((resolve, _) => {
    jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (!err && decoded) {
        resolve(decoded as AccessToken)
        return
      }

      if (!(err instanceof TokenExpiredError))
        throw new HttpError('Invalid access token', {
          statusCode: 401, cause: err as Error,
          debugMsg: 'Some error hash been occurred while parsing access token'
        })

      // Access token has expired. Return this object to issue a new access token
      // from the existing refresh token
      throw err
    })
  })
}


// Refresh Token utils
export interface RefreshToken {
  id: string
  type: UserType
  passwordHash: string
  userIP: string
  userAgent: string
  accessTokenHash: string
}


export async function getRefreshToken(req: Request, user: UserDoc, accessToken: string) {
  const userIP = req.headers['cf-connecting-ip'] || 
                 req.headers['x-real-ip'] ||
                 req.headers['x-forwarded-for'] ||
                 req.socket.remoteAddress || ''

  const userAgent = req.headers["user-agent"]
  const accessTokenHash = hashAccessToken(accessToken)

  return jwt.sign(
    {
      id: user._id,
      type: user.type,
      userIP, userAgent, accessTokenHash
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  )
}


export function setRefreshTokenToCookies(res: Response, refreshToken: string) {
  const EXPIRE_IN_7_DAYS =  7 * 24 * 60 * 60 * 1000

  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true, // Accessible only by web server
    secure: true, // https
    sameSite: "lax",
    maxAge: EXPIRE_IN_7_DAYS
  })
}


export function clearRefreshTokenFromCookies(res: Response) {
  res.clearCookie(
    env.REFRESH_TOKEN_COOKIE_NAME,
    { httpOnly: true, secure: true, sameSite: "lax" }
  )
}


export async function verifyRefreshToken(refreshToken: string): Promise<RefreshToken> {
  return new Promise((resolve, _) => {
    jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (!err && decoded) {
        resolve(decoded as RefreshToken)
        return
      }

      // If the refresh token is also expired, logout the client
      if (err instanceof TokenExpiredError)
        // Logout user and redirect them to /login
        throw new ForceReLogin('Session expired', {
          debugMsg: 'refresh token expired. Forcing client to re-login', cause: err
        })

      // Exit out if there's any other error while parsing refresh token
      throw new HttpError('Internal server error', {
        debugMsg: 'Error occurred while validating refresh token', cause: err as Error
      })
    })
  })
}


// Other utils
export async function updateTokensInCookies(
  req: Request, res: Response, user: UserDoc, options?: { accessToken?: string, refreshToken?: string }
) {
  const accessToken = options?.accessToken ?? await getAccessToken(user)
  const refreshToken = options?.refreshToken ?? await getRefreshToken(req, user, accessToken)
  setRefreshTokenToCookies(res, refreshToken)
  setAccessTokenToCookies(res, accessToken)

  return { refreshToken, accessToken }
}


export async function clearTokensInCookies(res: Response) {
  clearAccessTokenFromCookies(res)
  clearRefreshTokenFromCookies(res)
}
