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
  books: {
    _id: number
    name: string
    quantity: number
    unitPrice: number
  }[]
  orderTime: Date
  deliveredBy: Date
  status: OrderStatus
  totalAmount: number
}
