import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const WidgetSkeleton = ({ type }) => {
    if (type === 'kpi') {
        return (
            <div className="p-6 flex flex-col justify-between h-full bg-card rounded-xl border opacity-70">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <div className="mt-4">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        )
    }

    if (type === 'chart') {
        return (
            <div className="p-4 bg-card rounded-xl h-full flex flex-col opacity-70 border">
                <Skeleton className="h-5 w-1/3 mb-6" />
                <div className="flex-1 w-full min-h-[250px] flex items-end gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${Math.random() * 60 + 20}%` }} />
                    ))}
                </div>
            </div>
        )
    }

    // Fallback List/Table style
    return (
        <div className="p-4 bg-card rounded-xl h-full flex flex-col opacity-70 border">
            <Skeleton className="h-5 w-1/3 mb-6" />
            <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export const EmptyState = ({ title, message, icon: Icon, actionLabel, onAction }) => {
    return (
        <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center">
            {Icon && <div className="p-3 bg-muted rounded-full mb-3"><Icon className="h-6 w-6 text-muted-foreground" /></div>}
            <h3 className="text-sm font-semibold text-foreground mb-1">{title || 'Không có dữ liệu'}</h3>
            <p className="text-xs text-muted-foreground max-w-[250px] mb-4">
                {message || 'Trạng thái này hiện đang trống hoặc bộ lọc chưa phù hợp.'}
            </p>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    )
}
