import { useAuth } from "./hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"


interface AuthCheckerProps {
  userType: 'customer' | 'seller' | 'admin'
  redirectPath: string
}

export function AuthChecker({ userType, redirectPath }: AuthCheckerProps) {
  const { authState } = useAuth()
  const location = useLocation()
  const isAutheticated = authState.user !== null && userType === authState.user.type

  if (location.pathname)
    redirectPath += '?from=' + location.pathname

  return isAutheticated ? <Outlet /> : <Navigate to={redirectPath} />
}
