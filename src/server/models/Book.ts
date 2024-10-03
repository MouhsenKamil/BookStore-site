import mongoose, { Schema, Document } from 'mongoose';

interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  coverImage: string;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  coverImage: { type: String },
}, { timestamps: true });

export default mongoose.model<IBook>('Book', BookSchema);
