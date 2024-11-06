import mongoose, { Schema, Document } from "mongoose"


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
  blocked: boolean
  createdAt: Date
}

export type UserDoc = IUser & Document

export const User = mongoose.model<UserDoc>(
  'users',
  new Schema<UserDoc>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    type: { type: String, enum: UserType, default: UserType.CUSTOMER,
      validate: {
        validator: (val: string) => Object.keys(UserType).includes(val),
        message: props => `${props.value} is not a valid user type.`
      }
    },
    blocked: { type: Boolean, required: true, default: false },
  }, {
    timestamps: { createdAt: true, updatedAt: false },
  })
)
