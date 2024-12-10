export enum UserType {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export interface IUser {
  _id: string
  name: string
  email: string
  type: UserType
  blocked?: boolean
}

export interface IBlockableUser extends IUser {
  blocked: boolean
}

export interface IExtendedUser extends IBlockableUser {
  [key: string]: any
}
