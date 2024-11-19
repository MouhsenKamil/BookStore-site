import { ICreditCard } from "./creditCard"
import { IBlockableUser } from "./user"

export interface ICustomer extends IBlockableUser {
  creditCards: ICreditCard[]
}
