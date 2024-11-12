import { IBlockableUser } from "./user"

export interface ISeller extends IBlockableUser {
  passportNumber: string
  phoneNo: string
}
