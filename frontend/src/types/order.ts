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
  user: string
  books: {
    id: number
    name: string
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
