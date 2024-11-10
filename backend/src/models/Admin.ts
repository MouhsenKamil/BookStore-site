import mongoose, { Document, Schema } from "mongoose"
import { IUser, UserSchemaObj } from "./User"

export interface IAdmin extends IUser {}

type AdminDoc = IAdmin & Document

export const Admin = mongoose.model("admins", new Schema<AdminDoc>(UserSchemaObj))