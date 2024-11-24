import { useAuth } from "../hooks/useAuth"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import Page401 from "./ErrorPage/401"


interface AuthCheckerProps {
  userType: 'customer' | 'seller' | 'admin'
  redirectPath: string
}


export default function AuthChecker({ userType, redirectPath }: AuthCheckerProps) {
  const { authState } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isAutheticated = authState.user !== null
  const isAuthorizedUserType = isAutheticated && (userType === authState.user?.type)

  console.log(isAutheticated, isAuthorizedUserType)

  if (!isAutheticated) {
    if (location.pathname)
      redirectPath += '?from=' + location.pathname + location.search

    navigate(redirectPath)
    return
  }

  if (!isAuthorizedUserType)
    return <Page401 />

  return <Outlet />
}
