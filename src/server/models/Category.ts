import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  books: {
    bookId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  address: string;
  paymentMethod: 'card' | 'cash';
}

const OrderSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  address: { type: String, required: true },
  paymentMethod: { type: String, enum: ['card', 'cash'], required: true },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
