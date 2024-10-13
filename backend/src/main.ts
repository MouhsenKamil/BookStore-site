import express, { NextFunction, Request, Response } from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import path from "path"
import cookieParser from 'cookie-parser'

import apiRoutes from './routes/apiRoutes.ts'

import { connectDB } from './config/db.ts'
import mongoose from "mongoose"


dotenv.config({ path: "../.env" })

const PORT_ENV = process.env.VITE_PORT
const PORT = PORT_ENV ? parseInt(PORT_ENV) : 4000

const MONGO_DB_URI = (
  `mongodb://${process.env.VITE_MONGODB_ADMIN_USERNAME}:${process.env.VITE_MONGODB_ADMIN_PASSWORD}` +
  `@localhost:27017/?authSource=${process.env.VITE_BOOKSTORE_DB_NAME}&authMechanism=DEFAULT`
)

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/static', express.static(path.join(__dirname, 'public')))


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const message = err.message || 'Internal Server Error'
  res.status(500).json({ message })
})

// API Routes
app.use('/api', apiRoutes)

// Return 404 on unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Sorry can't find that!" })
})


// Run API backend
app
.listen(PORT, async () => {
  await connectDB(MONGO_DB_URI)
  console.log(`Express backend server is listening on localhost:${PORT}.`)
})
.close(async (err) => {
  if (err) console.error(err)
  console.log("Disconnecting from DB...")
  await mongoose.disconnect()
  console.log("Done.")
})
