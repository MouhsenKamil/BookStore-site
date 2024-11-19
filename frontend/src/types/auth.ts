// export type CustomerType = 

export type UserType = 'user' | 'customer' | 'seller' | 'admin'

export interface UserData {
  name: string
  email: string
  type: Exclude<UserType, 'user'>
}


export interface AuthState {
  user: UserData | null
  loading: boolean
  error: string | null
}


export interface ContextValues {
  authState: AuthState
  fetchAuthData: () => Promise<void>
}


export type RegisterFormInputs = {
  name: string
  email: string
  password: string
  confirmPassword?: string
  type: 'customer' | 'seller' | 'admin'
  phoneNo?: number
  passportNumber?: number
}


export type LoginFormInputs = {
  name: string
  email: string
  password: string
  type: 'customer' | 'seller' | 'admin'
}
