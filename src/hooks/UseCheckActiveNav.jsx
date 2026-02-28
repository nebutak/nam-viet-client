import { useLocation } from 'react-router-dom'

const useCheckActiveNav = () => {
  const { pathname } = useLocation()

  const checkActiveNav = (nav) => {
    if (nav === '/' && pathname === '/') return true

    const cleanNav = nav.replace(/^\//, '')
    const cleanPath = pathname.replace(/^\//, '')

    return cleanPath === cleanNav || cleanPath.startsWith(cleanNav + '/')
  }

  return { checkActiveNav }
}

export default useCheckActiveNav
