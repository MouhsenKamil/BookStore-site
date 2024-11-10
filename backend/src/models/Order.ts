import mongoose, { Schema, Document, Types } from 'mongoose'


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


export interface IOrder {
  user: Types.ObjectId
  books: {
    id: Types.ObjectId
    quantity: number
    unitPrice: number
  }[]
  orderTime: Date
  deliveredBy: Date
  status: OrderStatus
  address: string
  totalAmount: number
  paymentMethod: PaymentMethod
}

export type OrderDoc = IOrder & Document

export const Order = mongoose.model<OrderDoc>(
  'orders',
  new Schema<OrderDoc>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    deliveredBy: { type: Date, required: true, validate: {
      validator: (val: Date) => val > (new Date()),
      message: "delivery date can't be nearly equal to current time."
    }},
    status: { type: String, enum: OrderStatus, default: OrderStatus.PACKAGING },
    address: { type: String, required: true },
    totalAmount: {
      type: Number, required: true, default: function () {
        return this.books.reduce((total, book) => total + book.quantity * book.unitPrice, 0)
      }
    },
    paymentMethod: { type: String, enum: PaymentMethod, required: true },
  }, {
    timestamps: { createdAt: 'orderTime', updatedAt: false }
  }
))
