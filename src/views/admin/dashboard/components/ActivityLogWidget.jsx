import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import {
    History,
    ShoppingBag,
    Package,
    Activity,
    DollarSign,
    User,
    ArrowRight,
    CheckCircle
} from 'lucide-react'

// Color and icon mapping per activity type
const TYPE_CONFIG = {
    order: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60' },
    inventory: { icon: Package, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60' },
    production: { icon: Activity, color: 'bg-violet-100 text-violet-600 dark:bg-violet-950/60' },
    finance: { icon: DollarSign, color: 'bg-orange-100 text-orange-600 dark:bg-orangeald-950/60' },
    user: { icon: User, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800' },
    create: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
    update: { icon: ArrowRight, color: 'bg-blue-100 text-blue-600' },
}

const getTypeFromAction = (action, type) => {
    if (type) return TYPE_CONFIG[type] || TYPE_CONFIG.user
    const a = (action || '').toLowerCase()
    if (a.includes('create') || a.includes('tạo')) return TYPE_CONFIG.create
    if (a.includes('update') || a.includes('cập nhật')) return TYPE_CONFIG.update
    return TYPE_CONFIG.user
}

const formatTime = (activity) => {
    if (activity.timestamp || activity.createdAt) {
        const d = new Date(activity.timestamp || activity.createdAt)
        return {
            time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        }
    }
    return { time: activity.time || '', date: activity.date || '' }
}

export const ActivityLogWidget = ({ activities, loading }) => {
    if (loading) {
        return (
            <Card className="h-full border-muted/20 animate-pulse">
                <CardHeader className="pb-2"><div className="h-5 w-1/3 bg-muted rounded" /></CardHeader>
                <CardContent>
                    <div className="space-y-4 pt-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex gap-4">
                                <div className="h-8 w-8 rounded-lg bg-muted flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-full bg-muted rounded" />
                                    <div className="h-3 w-2/3 bg-muted rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const displayActivities = activities?.length > 0 ? activities : []

    return (
        <Card className="h-full border-muted/20 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-2 border-b bg-muted/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                        <History className="h-4 w-4" />
                        Nhật ký hoạt động
                    </CardTitle>
                    {displayActivities.length > 0 && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {displayActivities.length} mục
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                    {displayActivities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-sm gap-2">
                            <History className="h-8 w-8 opacity-30" />
                            <p>Chưa có hoạt động nào</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {displayActivities.map((activity, index) => {
                                const config = getTypeFromAction(activity.action, activity.type)
                                const TypeIcon = config.icon
                                const { time, date } = formatTime(activity)

                                return (
                                    <div key={activity.id || index} className="flex gap-3 relative group">
                                        {/* Timeline connector */}
                                        {index < displayActivities.length - 1 && (
                                            <div className="absolute left-[18px] top-9 bottom-0 w-px bg-border" />
                                        )}

                                        {/* Color-coded icon */}
                                        <div className={`mt-0.5 flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center relative z-10 ${config.color}`}>
                                            <TypeIcon className="h-4 w-4" />
                                        </div>

                                        <div className="flex-1 pb-2 flex justify-between items-start min-w-0">
                                            <div className="flex flex-col min-w-0">
                                                <p className="font-semibold text-foreground text-sm leading-snug">
                                                    {activity.action || (activity.type === 'create' ? 'Tạo mới' : 'Cập nhật')}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                    {activity.description || activity.target || activity.desc || activity.action_target}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Bởi <span className="text-foreground font-medium">
                                                        {activity.user_name || activity.user || activity.created_by_name || 'Hệ thống'}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-end text-[11px] text-muted-foreground font-medium shrink-0 ml-2">
                                                <span>{time}</span>
                                                <span>{date}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
