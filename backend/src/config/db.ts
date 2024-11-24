import mongoose from 'mongoose'

import { logMongoDBErrors } from '../middlewares/logger'


interface connectDBProps {
  // host: string
  // port: number
  // dbName: string
  uri: string
  username: string
  password: string
}


// export async function connectDB({host, port, dbName, username, password}: connectDBProps) {
export async function connectDB({uri, username, password}: connectDBProps) {
  console.log("Initializing connection with the BookStore MongoDB Database...")

  await mongoose.connect(
    // `mongodb://${host}:${port}/${dbName}?authSource=${dbName}&authMechanism=DEFAULT`, {
    // `mongodb://${uri}/${dbName}?authSource=${dbName}&authMechanism=DEFAULT`, {
    uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      family: 4, // use this in case mongoose.connect function takes a long time to connect
      user: username,
      pass: password,
      autoIndex: false,
    }
  ).catch(err => {
    logMongoDBErrors(err)
    process.exit(1)
  })
  console.log('MongoDB connected successfully.')

  mongoose.connection.on('error', err => {
    logMongoDBErrors(err)
  })
}

