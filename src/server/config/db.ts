import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  try {
    console.log("Initializing connection with the BookStore MongoDB Database...")
    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Use createIndex for unique indexes
      // useFindAndModify: false // Avoid deprecation warning for findAndModify
    });
    console.log('MongoDB connected successfully.')
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
}
