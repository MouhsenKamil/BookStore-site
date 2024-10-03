import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  cart: {
    bookId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
