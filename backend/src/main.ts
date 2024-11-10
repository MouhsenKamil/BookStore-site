import express, { Request, Response, NextFunction } from "express"
import 'express-async-errors'

import mongoose from "mongoose"
import cors from 'cors'
import morgan from 'morgan'
import path from "path"
import cookieParser from 'cookie-parser'
import https from 'https'
import fs from 'fs'
import cookieSession from 'cookie-session'

import apiRoutes from './routes/apiRoutes.ts'

import env from './config/env.ts'
import { connectDB } from './config/db.ts'

import errorHandler from './middlewares/errorHandler.ts'


const PORT = env.BACKEND_PORT
const app = express()

// Middlewares
app.disable('x-powered-by')
app.use(express.json())
app.use(cors())
app.use(morgan('short')) // previously 'dev'
app.use(
  cookieSession({
    secret: env.COOKIE_SESSION_SECRET,
    sameSite: true,
    httpOnly: true,  // Don't let browser javascript access cookies.
    secure: true, // Only use cookies over https.
  })
)
app.use(cookieParser())
app.use('/api', apiRoutes) // API Routes

// app.use('*', function(req, res) {
//   res.redirect('https://' + req.hostname + req.originalUrl);
// })

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from express js api side')
})

// Return 404 on unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Sorry can't find that!" })
})

app.use(errorHandler) // Error handling middleware


// Run API backend
// app
// .listen(PORT, async () => {
//   await connectDB(MONGO_DB_URI)
//   console.log(`Express backend server is listening on localhost:${PORT}.`)
// })
// .close(async (err) => {
//   if (err) console.error(err)
//   console.log("Disconnecting from DB...")
//   await mongoose.disconnect()
//   console.log("Done.")
// })


async function onclose() {
  console.log("Disconnecting from DB...")
  await mongoose.disconnect()
  console.log("Done.")
  process.exit(1)
}


// for (const event of ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM"])
//   process.on(event, onclose)


const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'cert.pem'))
}, app)


sslServer
  .listen(PORT, async () => {
    await connectDB({
      host: 'localhost',
      // host: `${env.MONGODB_ADMIN_USERNAME}:${env.MONGODB_ADMIN_PASSWORD}@localhost`,
      port: env.MONGODB_PORT,
      dbName: env.BOOKSTORE_DB_NAME,
      username: env.MONGODB_ADMIN_USERNAME,
      password: env.MONGODB_ADMIN_PASSWORD
    })
    console.log(`Express backend server is listening on https://localhost:${PORT}`)
  })
  .on('error', async (err) => {
    console.error(err, err.stack)
    sslServer.close()
    // onclose()
  })
  .on('close', onclose)
