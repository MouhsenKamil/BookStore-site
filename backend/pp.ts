import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { createStream } from "rotating-file-stream";

const app = express();

// Create a write stream for error logs

// const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), {
//   flags: 'a',
// });

// Define a custom token for error message logging
morgan.token('error', (req: Request, res: Response) => {
  return res.statusCode >= 400 ? res.statusMessage : '';
});

// Log errors using Morgan to the error log file
app.use(
  morgan(':method :url :status :req[header] :res[content-length] - :response-time ms :error', {
    // skip: (req, res) => res.statusCode < 400, // Log only 4xx and 5xx responses
    stream: createStream('error.log', {
      interval: '1d',
      maxSize: '30M',
      compress: 'gzip',
    }),
    immediate: true,
  })
);

// Sample route to test error logging
app.get('/', (req: Request, res: Response) => {
  throw new Error('This is a test error');
});

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send('Something broke!');
  next(err); // Ensure Morgan logs the error
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
