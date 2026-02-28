import { useSocket } from '@/contexts/socket-context'
import { useEffect } from 'react'

const useSocketEvent = (eventHandlers) => {
  const socket = useSocket()

  useEffect(() => {
    if (!socket) {
      return
    }

    Object.keys(eventHandlers).forEach((event) => {
      socket.on(event, eventHandlers[event])
    })

    return () => {
      Object.keys(eventHandlers).forEach((event) => {
        socket.off(event, eventHandlers[event])
      })
    }
  }, [socket, eventHandlers])
}

export default useSocketEvent
