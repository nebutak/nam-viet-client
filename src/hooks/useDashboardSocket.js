import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.PROD
    ? import.meta.env.VITE_SERVER_URL_PRODUCTION
    : import.meta.env.VITE_SERVER_URL_DEVELOPMENT

export const useDashboardSocket = () => {
    const [socket, setSocket] = useState(null)
    const [realtimeData, setRealtimeData] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!SOCKET_URL) {
            console.warn('SOCKET_URL is not configured')
            return
        }

        const newSocket = io(SOCKET_URL, {
            path: '/socket.io',
            transports: ['websocket'],
            autoConnect: true,
            withCredentials: true
        })

        newSocket.on('connect', () => {
            console.log('🔗 Đã kết nối Socket.io Realtime Dashboard')
            setIsConnected(true)
        })

        newSocket.on('disconnect', () => {
            console.log('❌ Mất kết nối Socket.io')
            setIsConnected(false)
        })

        newSocket.on('dashboard_update', (data) => {
            console.log('⚡ Dữ liệu Dashboard thời gian thực cập nhật:', data)
            setRealtimeData(data)
        })

        setSocket(newSocket)

        return () => {
            newSocket.off('connect')
            newSocket.off('disconnect')
            newSocket.off('dashboard_update')
            newSocket.disconnect()
        }
    }, [])

    return { socket, realtimeData, isConnected }
}
