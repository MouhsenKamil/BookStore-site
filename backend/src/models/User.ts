import mongoose, { Document, Schema, ValidatorProps } from "mongoose"


export enum UserType {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export interface IUser {
  name: string
  email: string
  passwordHash: string
  type: UserType
  blocked?: boolean
}

export interface IBlockableUser extends IUser {
  blocked: boolean
}

export const UserSchemaObj = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  type: { type: String, enum: UserType, default: UserType.CUSTOMER,
    validate: {
      validator: (val: string) => Object.values(UserType).includes(val as UserType),
      message: (props: ValidatorProps) => `${props.value} is not a valid user type.`
    }
  },
}

export type UserDoc = IUser & Document

export const User = mongoose.model<UserDoc>(
  'users',
  new Schema<UserDoc>(UserSchemaObj, {
    timestamps: { createdAt: true, updatedAt: false },
  }),
  'users'
)
