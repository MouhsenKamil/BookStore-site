import { redirect } from "react-router-dom"
import axios from "axios"


export function Logout() {
  axios.post('/api/auth/logout')
    .then(response => {
      if (response.status === 204)
        redirect('/')

      redirect('/')
    })

  return (
    <h1>Logging out...</h1>
  )
}
