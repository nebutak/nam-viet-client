import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  // Use VITE_ environment variables commonly found in Vite apps
  const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

  useEffect(() => {
    const socketIo = io(serverURL)
    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [serverURL])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}
