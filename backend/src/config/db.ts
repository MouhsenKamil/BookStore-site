import mongoose from 'mongoose'

import { logErrors } from '../middlewares/logger'


interface connectDBProps {
  host: string
  port: number
  dbName: string
  username: string
  password: string
}


export async function connectDB({host, port, dbName, username, password}: connectDBProps) {
  console.log("Initializing connection with the BookStore MongoDB Database...")

  await mongoose.connect(
    // `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${dbName}&authMechanism=DEFAULT`, {
    `mongodb://${host}:${port}/${dbName}?authSource=${dbName}&authMechanism=DEFAULT`, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      family: 4, // use this in case mongoose.connect function takes a long time to connect
      user: username,
      pass: password,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Use createIndex for unique indexes
      // useFindAndModify: false // Avoid deprecation warning for findAndModify
    }
  ).catch(async (err) => {
    await logErrors(err, 1, 'mongoErrLog.log')
    process.exit(1)
  })
  console.log('MongoDB connected successfully.')

  mongoose.connection.on('error', async (err) => {
    await logErrors(err, 1, 'mongoErrLog.log')
  })
}
