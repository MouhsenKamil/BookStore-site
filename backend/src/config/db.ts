import mongoose from 'mongoose'

export async function connectDB(uri: string) {
  console.log("Initializing connection with the BookStore MongoDB Database...")
  mongoose.connect(uri, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true, // Use createIndex for unique indexes
    // useFindAndModify: false // Avoid deprecation warning for findAndModify
  })
  .then(() => {
    console.log('MongoDB connected successfully.')
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })

  mongoose.connection.on('error', err => {
      // console.log(err)
      console.error(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
  })
}
