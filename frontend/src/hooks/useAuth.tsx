import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'


interface User {
  name: string
  email: string
  type: 'customer' | 'admin' | 'seller'
}


interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface ContextValues {
  authState: AuthState
  fetchAuthData: () => Promise<void>
}


export const AuthContext = createContext<ContextValues | undefined>(undefined)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null, loading: true, error: null
  })

  async function fetchAuthData() {
    try {
      const response = await axios.get<{ userData: User }>(
        '/api/auth/verify', { withCredentials: true }
      )

      setAuthState({
        user: response.data.userData,
        loading: false,
        error: null,
      })

    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.response?.data?.message || error.message || 'Something went wrong',
      })
    }

    console.log(authState.user === null ? "user login detected" : 'user have not logged in')
  }

  useEffect(() => {
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
