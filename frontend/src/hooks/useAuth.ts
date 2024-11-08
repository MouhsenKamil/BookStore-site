import { useEffect, useState } from 'react'
import axios from 'axios'


interface User {
  name: string
  email: string
  type: string
}


interface UseAuthState {
  user: User | null
  loading: boolean
  error: string | null
}


export function useAuth() {
  const [authState, setAuthState] = useState<UseAuthState>({
    user: null, loading: true, error: null
  })

  useEffect(() => {
    async function fetchAuthData() {
      try {
        const response = await axios.get<User>('/api/auth/verify', {
          withCredentials: true
        })

        setAuthState({
          user: response.data,
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
    }

    fetchAuthData()
  }, [])

  return authState
}
