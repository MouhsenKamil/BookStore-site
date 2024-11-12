export enum UserType {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export interface IUser {
  name: string
  email: string
  type: UserType
}

export interface IBlockableUser extends IUser {
  blocked: boolean
}

export interface IExtendedUser extends IBlockableUser {
  [key: string]: any
}
