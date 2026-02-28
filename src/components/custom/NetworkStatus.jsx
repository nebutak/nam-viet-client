import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Đã kết nối internet', {
        position: 'bottom-left',
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error('Mất kết nối internet. Vui lòng kiểm tra lại đường truyền', {
        position: 'bottom-left',
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return null
}

export default NetworkStatus
