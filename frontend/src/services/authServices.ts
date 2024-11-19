import axios, { AxiosResponse } from "axios"
import { UserData, RegisterFormInputs, UserType, LoginFormInputs } from "../types/auth"


const AUTH_API_URL = "'/api/auth"

export async function registerUser(
  data: RegisterFormInputs, { userType }: { userType: UserType }
): Promise<AxiosResponse<any, any>> {

  let dataObj: { [key: string]: any } = {
    email: data.email,
    password: data.password,
    name: data.name,
    type: userType === "user" ? "customer" : userType,
  }

  if (dataObj.type === "seller")
    dataObj = {
      ...dataObj,
      phoneNo: data.phoneNo,
      passportNumber: data.passportNumber
    }

  return await axios.post(`${AUTH_API_URL}register`, dataObj)
}


export async function loginUser(
  data: LoginFormInputs, { userType }: { userType: Exclude<UserType, 'customer'> }
): Promise<AxiosResponse<any, any>>  {

  data.type = userType === 'user' ? 'customer': userType
  return await axios.post(`${AUTH_API_URL}login`, data)
}


export async function verifyUser(): Promise<AxiosResponse<{ userData: UserData }>> {
  return await axios.get<{ userData: UserData }>(
    `${AUTH_API_URL}verify`, { withCredentials: true }
  )
}