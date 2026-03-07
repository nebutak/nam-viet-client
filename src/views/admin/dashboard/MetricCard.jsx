import React from 'react'
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Inline SVG sparkline — no external dep needed
const InlineSparkline = ({ data, color }) => {
    if (!data?.length || data.length < 2) return null
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const w = 100, h = 28
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / range) * h
        return `${x},${y}`
    }).join(' ')
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}


// Color config per widget id
const CARD_COLORS = {
    'revenue-kpi': { bg: 'bg-blue-50 dark:bg-blue-950/30', icon: 'bg-blue-500', text: 'text-blue-500' },
    'orders-kpi': { bg: 'bg-indigo-50 dark:bg-indigo-950/30', icon: 'bg-indigo-500', text: 'text-indigo-500' },
    'debts-kpi': { bg: 'bg-orange-50 dark:bg-orange-950/30', icon: 'bg-orange-500', text: 'text-orange-500' },
    'production-kpi': { bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: 'bg-emerald-500', text: 'text-emerald-500' },
}
const DEFAULT_COLOR = { bg: 'bg-violet-50 dark:bg-violet-950/30', icon: 'bg-violet-500', text: 'text-violet-500' }

export const MetricCard = ({ title, value, trend, trendValue, icon: Icon, loading, onClick, widgetId, sparkData }) => {
    const isPositive = trend === 'up'
    const isNegative = trend === 'down'
    const colors = CARD_COLORS[widgetId] || DEFAULT_COLOR

    const trendIcon = isPositive
        ? <TrendingUp className="h-3 w-3" />
        : isNegative
            ? <TrendingDown className="h-3 w-3" />
            : <Minus className="h-3 w-3" />

    return (
        <div
            className={`relative p-5 flex flex-col justify-between h-full rounded-xl border shadow-sm transition-all duration-200 overflow-hidden
                ${colors.bg}
                ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]' : ''}
                ${loading ? 'opacity-70 pointer-events-none' : ''}
            `}
            onClick={onClick}
        >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground leading-tight">{title}</h3>
                {loading ? (
                    <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                ) : Icon && (
                    <div className={`h-8 w-8 rounded-lg ${colors.icon} flex items-center justify-center shadow-sm`}>
                        <Icon className="h-4 w-4 text-white" />
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="text-2xl font-bold text-foreground tracking-tight mb-1">
                {loading ? <div className="h-7 w-24 bg-muted/50 rounded animate-pulse" /> : value}
            </div>

            {/* Trend */}
            {(trendValue || trendValue === 0) && !loading && (
                <p className={`text-xs flex items-center gap-1 font-medium mb-2
                    ${isPositive ? 'text-emerald-600' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {trendIcon}
                    {isPositive ? '+' : ''}{trendValue}% so với kỳ trước
                </p>
            )}

            {/* Sparkline mini chart */}
            {sparkData?.length > 1 && !loading && (
                <div className="absolute bottom-0 right-0 left-0 h-12 opacity-25">
                    <Sparklines data={sparkData} margin={0}>
                        <SparklinesLine
                            style={{ stroke: isPositive ? '#22c55e' : '#ef4444', fill: 'none', strokeWidth: 2 }}
                        />
                    </Sparklines>
                </div>
            )}

            {/* Click hint */}
            {onClick && !loading && (
                <p className="text-[10px] text-muted-foreground/60 mt-1">Nhấn để xem chi tiết →</p>
            )}
        </div>
    )
}
