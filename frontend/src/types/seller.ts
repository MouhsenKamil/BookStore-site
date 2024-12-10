import { IBlockableUser } from "./user"

export interface ISeller extends IBlockableUser {
  passportNo: string
  phoneNo: string
}
