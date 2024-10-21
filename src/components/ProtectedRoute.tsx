import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user_profile = Cookies.get('user_profile')
  const user = user_profile ? JSON.parse(user_profile) : null

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to='/sign-in-2' />
  }

  return <>{children}</>
}

export default ProtectedRoute
