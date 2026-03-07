import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Clock, Calendar, RefreshCw } from 'lucide-react'
import { Button } from '../../../../components/ui/button'

const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 5) return { text: 'Làm việc khuya rồi', emoji: '🌙' }
    if (h < 12) return { text: 'Chào buổi sáng', emoji: '☀️' }
    if (h < 14) return { text: 'Chào buổi trưa', emoji: '🌤' }
    if (h < 18) return { text: 'Chào buổi chiều', emoji: '🌆' }
    return { text: 'Chào buổi tối', emoji: '🌙' }
}

export const DashboardHeader = ({ onRefresh, loading, isConnected }) => {
    const [now, setNow] = useState(new Date())
    const user = useSelector((state) => state.auth?.user || state.user?.currentUser)

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const greeting = getGreeting()
    const userName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Admin'

    const dateStr = now.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            {/* Greeting left */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <span>{greeting.emoji}</span>
                    <span>{greeting.text}, <span className="text-primary">{userName}</span>!</span>
                </h1>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {dateStr}
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5 font-mono font-medium text-foreground tabular-nums">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {timeStr}
                    </span>
                </div>
            </div>

            {/* Refresh right */}
            <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 shrink-0"
            >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
            </Button>
        </div>
    )
}
