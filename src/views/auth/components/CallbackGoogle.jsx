import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
// import { callbackGoogle, getAuthUserRolePermissions } from '@/stores/AuthSlice'

const CallbackGoogle = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleCallbackGoogle = useCallback(async () => {
    try {
      // Logic from crm-template:
      // const searchParams = new URLSearchParams(location.search)
      // await dispatch(callbackGoogle(searchParams)).unwrap()
      // await dispatch(getAuthUserRolePermissions()).unwrap()

      // Mocking for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đăng nhập Google thành công (Demo)')
      localStorage.setItem('accessToken', 'google-mock-token')
      localStorage.setItem('permissionCodes', JSON.stringify([]))

      navigate('/dashboard')
    } catch (error) {
      navigate('/')
      console.log('Submit error: ', error)
    }
  }, [location.search, navigate]) // Dispatch removed from dependency temporarily to avoid warnings since it's mock

  useEffect(() => {
    handleCallbackGoogle()
  }, [handleCallbackGoogle])

  return null
}

export default CallbackGoogle
