import { Navigate } from 'react-router-dom'
import ErrorPage from '../views/error/ErrorPage'

const publicRoutes = [
  '/',
  '/forgot-password',
  '/reset-password',
  '*',
]

const privateRoutes = {
  '/dashboard': [],
}

const RequireAuth = ({ component: Component, path, ...rest }) => {
  const isLoggedIn = !!localStorage.getItem('accessToken')
  const isPublicRoute = publicRoutes.includes(path)
  const userPermissions =
    JSON.parse(localStorage.getItem('permissionCodes')) || []

  if (!path) {
    return <Navigate to="/" />
  }

  const requiredPermissions = privateRoutes[path] || []
  if (!isPublicRoute && !isLoggedIn) {
    return <Navigate to="/" />
  }

  if (
    hasSufficientPermissions(userPermissions, requiredPermissions) ||
    isPublicRoute
  ) {
    return <Component {...rest} />
  }

  return (
    <ErrorPage
      code={403}
      message={'Từ chối truy cập'}
      description={'Opps!!! Có vẻ bạn đang cố truy cập tài nguyên trái phép 🙄'}
    />
  )
}

const hasSufficientPermissions = (userPermissions, requiredPermissions) => {
  if (requiredPermissions == null) return false

  if (Array.isArray(requiredPermissions)) {
    if (requiredPermissions.length === 0) return true
    return requiredPermissions.some((p) => userPermissions.includes(p))
  }

  if (typeof requiredPermissions === 'string') {
    return requiredPermissions === ''
      ? true
      : userPermissions.includes(requiredPermissions)
  }

  return false
}

export default RequireAuth
