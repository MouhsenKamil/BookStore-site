import express, { Response } from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import ViteExpress from "vite-express"

// Import routes
import authRoutes from './routes/authRoutes.ts'
import bookRoutes from './routes/bookRoutes.ts'
import orderRoutes from './routes/orderRoutes.ts'

// Import custom middlewares and utils
import { errorHandler } from './middlewares/errorHandler.ts'
import { connectDB } from './config/db.ts'

dotenv.config()

const app = express()

// Define the port number
const PORT_ENV = process.env.VITE_PORT
const PORT = PORT_ENV ? parseInt(PORT_ENV) : 3000

const MONGO_DB_URI = (
  `mongodb://${process.env.VITE_MONGODB_ADMIN_USERNAME}:${process.env.VITE_MONGODB_ADMIN_PASSWORD}` +
  `@localhost:27017/?authSource=${process.env.VITE_BOOKSTORE_DB_NAME}&authMechanism=DEFAULT`
)

app.get("/api", (_, res: Response) => {
  res.send("Hello from express js")
})

// Middleware
app.use(express.json()) // Parse JSON bodies
app.use(cors()) // Enable CORS for cross-origin requests
app.use(morgan('dev')) // Logging

// Connect to MongoDB

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/orders', orderRoutes)

// Error handling middleware
app.use(errorHandler)

ViteExpress.listen(app, PORT, () => {
    connectDB(MONGO_DB_URI)
    console.log(`Express backend Server is listening on port ${PORT}.`)
  }
)
