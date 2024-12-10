import { IBookInCart } from "./cart"


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
  _id: string
  user: string
  books: IBookInCart[]
  orderTime: Date | string
  deliveredBy: Date | string
  status: OrderStatus
  totalAmount: number
}


export interface IOrderWithDateObj extends IOrder {
  orderTime: Date
  deliveredBy: Date
}


export type createOrderProps = {
  type: 'bookOnly',
  data: { bookId: string, quantity: number }
} | {
  type: 'cart',
  data: { bookId: string, quantity: number }[]
}
