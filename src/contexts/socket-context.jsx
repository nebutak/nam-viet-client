import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  const SOCKET_URL = import.meta.env.PROD
    ? import.meta.env.VITE_SERVER_URL_PRODUCTION
    : import.meta.env.VITE_SERVER_URL_DEVELOPMENT

  useEffect(() => {
    // DISABLING SOCKET IO TEMPORARILY TO FIX CORS POLLING ERRORS
    // const socketIo = io(SOCKET_URL, {
    //   path: '/socket.io',
    //   transports: ['websocket'],
    //   autoConnect: true,
    //   withCredentials: true
    // })
    // setSocket(socketIo)

    return () => {
      // if (socketIo) socketIo.disconnect()
    }
  }, [SOCKET_URL])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}
