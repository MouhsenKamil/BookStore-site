import { createContext, useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'

import { AuthState, AuthContextValues } from '../types/auth'
import { verifyUser } from '../services/authServices'


export const AuthContext = createContext<AuthContextValues | undefined>(undefined)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null, loading: true, error: null
  })

  async function fetchAuthData() {
    try {
      const response = await verifyUser()

      setAuthState({
        user: response.data.userData,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      if (error instanceof AxiosError)
        setAuthState({
          user: null,
          loading: false,
          error: error.response?.data.message || error.message || 'Something went wrong',
        })
    }

    console.log(authState.user !== null ? "User login detected" : 'User have not logged in')
  }

  useEffect(() => {
    console.log('auth reloaded')
    fetchAuthData()
  }, [])

  return (
    <AuthContext.Provider value={{authState, fetchAuthData}}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  const authUtils = useContext(AuthContext)
  if (!authUtils)
    throw new Error('useAuth must be used within an AuthProvider')

  return authUtils
}
