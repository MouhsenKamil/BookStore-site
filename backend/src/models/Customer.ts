import mongoose, { Types, Schema } from "mongoose"
import { IBlockableUser, UserSchemaObj } from "./User"


export interface ICustomer extends IBlockableUser {
  creditCards: Types.ObjectId[]
}

type CustomerDoc = ICustomer & Document

export const Customer = mongoose.model<CustomerDoc>(
  'customers',
  new Schema<CustomerDoc>({
    ...UserSchemaObj,
    creditCards: { type: [Schema.Types.ObjectId], required: true, ref: 'CreditCard' },
    blocked: { type: Boolean, required: true, default: false },
  }, {
    timestamps: { createdAt: true, updatedAt: false },
  })
)
