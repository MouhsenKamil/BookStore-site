import mongoose, { Schema, Document } from 'mongoose'


interface ICreditCard {
  cardNumber: number
  cardHolderName: string
  expiryDate: Date
  cvv: number
}


type CreditCardDoc = ICreditCard & Document


export const CreditCard = mongoose.model<CreditCardDoc>('credit_cards', new Schema({
  cardNumber: { type: Number, required: true },
  cardHolderName: { type: String, required: true },
  expiryDate: { type: Date, required: true, validate: {
    validator: (val: Date) => val > (new Date()),
    message: 'Credit card is already expired'
  } },
  cvv: { type: Number, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
}))
