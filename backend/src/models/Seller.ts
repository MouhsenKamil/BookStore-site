import mongoose, { Schema, Document } from "mongoose"
import { IBlockableUser, UserSchemaObj } from './User.ts'


export interface ISeller extends IBlockableUser {
  passportNo: string
  phoneNo: string
}

type SellerDoc = ISeller & Document

const PHONE_NUMBER_REGEX = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i
// const PASSPORT_NUMBER_REGEX = /^[0-9]{2}[a-z]{3}[CPHFATBLJG]{1}[a-z]{1}[0-9]{4}[a-z]{1}[0-9a-z]{1}Z[0-9a-z]{1}$/i
const PASSPORT_NUMBER_REGEX = /^[A-Z][1-9][0-9]\s?[0-9]{4}[1-9]$/g


export const Seller = mongoose.model<SellerDoc>(
  'sellers',
  new Schema<SellerDoc>({
    ...UserSchemaObj,
    blocked: { type: Boolean, required: true, default: false },
    passportNo: { type: String, required: true, validate: {
      validator: (val: string) => PASSPORT_NUMBER_REGEX.test(val)
    }},
    phoneNo: { type: String, required: true, validat: {
      validator: (val: string) => PHONE_NUMBER_REGEX.test(val)
    }}
  }, {
    timestamps: { createdAt: true, updatedAt: false },
  })
)
