import mongoose, { Schema, Document, Types } from 'mongoose'
import { IBookInCart } from './Cart'


export enum OrderStatus {
  PACKAGING = 'packaging',
  ON_DELIVERY = 'on_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  ABORTED = 'aborted'
}


export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card'
}

export interface ICheckoutFormData {
  homeNo: string
  street: string
  pinCode: number
  city: string
  state: string
  country: string
  phoneNo: number
  paymentMethod: PaymentMethod
}

export interface IOrder extends ICheckoutFormData {
  user: Types.ObjectId
  books: IBookInCart[]
  orderTime: Date
  deliveredBy: Date
  status: OrderStatus
}

type OrderDoc = IOrder & Document


export const Order = mongoose.model<OrderDoc>(
  'orders',
  new Schema<OrderDoc>({
    user: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    books: [
      {
        _id: false,
        id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true },
        // unitPrice: { type: Number, required: true },
      },
    ],
    deliveredBy: { type: Date, required: true, validate: {
      validator: (val: Date) => val > (new Date()),
      message: "delivery date can't be nearly equal to current time."
    }},
    status: { type: String, enum: OrderStatus, default: OrderStatus.PACKAGING },
    homeNo: { type: String, required: true },
    street: { type: String, required: true },
    pinCode: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    // totalAmount: {
    //   type: Number, required: true, default: function () {
    //     return this.books.reduce((total, book) => total + book.quantity * book.unitPrice, 0)
    //   }
    // },
    paymentMethod: { type: String, enum: PaymentMethod, required: true },
  }, {
    timestamps: { createdAt: 'orderTime', updatedAt: false }
  }
))
