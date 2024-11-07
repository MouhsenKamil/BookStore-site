import { useEffect, useState } from "react"
import axios from "axios"


interface ClientIDData {
  name: string
  email: string
  type: string
}


interface UseAuthState {
  user: ClientIDData | null
  loading: boolean
  error: string | null
}



export function useAuth() {
  const [clientData, setClientData] = useState<ClientIDData>({} as ClientIDData)
  const [authState, setAuthState] = useState(false)

  useEffect(() => {
    async function fetchAuthData() {
      const res = await axios.get<ClientIDData>("/api/auth/verify", {
        withCredentials: true, // Include cookies for authentication
      })
      setClientData(res.data)
      setAuthState({
        res.data, 
      })

    }

    fetchAuthData()
  }, [])

  return clientData
}
