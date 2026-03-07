import React, { useState } from 'react'
import { Target, TrendingUp, Edit3, Check, X } from 'lucide-react'

const vndCompact = (v) =>
    new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(v || 0))

const STORAGE_KEY = 'dashboard_revenue_target'

export const RevenueTargetWidget = ({ currentRevenue = 0, loading }) => {
    const [target, setTarget] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? Number(saved) : 500000000 // Default 500M
    })
    const [editing, setEditing] = useState(false)
    const [inputVal, setInputVal] = useState(target)

    const current = Number(currentRevenue || 0)
    const percent = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
    const remaining = Math.max(target - current, 0)

    const handleSave = () => {
        const v = Number(inputVal)
        if (v > 0) {
            setTarget(v)
            localStorage.setItem(STORAGE_KEY, String(v))
        }
        setEditing(false)
    }

    const getBarColor = () => {
        if (percent >= 100) return 'bg-emerald-500'
        if (percent >= 70) return 'bg-blue-500'
        if (percent >= 40) return 'bg-orange-400'
        return 'bg-red-500'
    }

    const getStatusText = () => {
        if (percent >= 100) return '✅ Đã đạt mục tiêu tháng!'
        if (percent >= 70) return '🔥 Đang tiến tốt'
        if (percent >= 40) return '⚡ Cần tăng tốc'
        return '⚠️ Cần cải thiện'
    }

    if (loading && !currentRevenue) {
        return (
            <div className="p-4 bg-card border rounded-xl h-full shadow-sm animate-pulse">
                <div className="h-4 w-1/3 bg-muted rounded mb-4" />
                <div className="h-3 w-full bg-muted rounded-full mb-3" />
                <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
        )
    }

    return (
        <div className="p-5 bg-card border rounded-xl h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Target className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Mục tiêu Doanh thu</h3>
                        <p className="text-[11px] text-muted-foreground">Tiến trình tháng này</p>
                    </div>
                </div>
                <button
                    onClick={() => { setEditing(!editing); setInputVal(target) }}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Chỉnh mục tiêu"
                >
                    <Edit3 className="h-4 w-4" />
                </button>
            </div>

            {/* Edit target */}
            {editing && (
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="number"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Nhập mục tiêu (VND)"
                        className="flex-1 text-sm border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={handleSave} className="p-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90">
                        <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditing(false)} className="p-1.5 bg-muted rounded-md hover:opacity-90">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Numbers */}
            <div className="mb-3">
                <div className="flex items-end justify-between mb-1">
                    <div>
                        <p className="text-2xl font-bold text-foreground">{vndCompact(current)} ₫</p>
                        <p className="text-xs text-muted-foreground">/ {vndCompact(target)} ₫ mục tiêu</p>
                    </div>
                    <div className={`text-2xl font-bold ${percent >= 100 ? 'text-emerald-500' : percent >= 70 ? 'text-blue-500' : 'text-orange-500'}`}>
                        {percent}%
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-3 rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* Status & remaining */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">{getStatusText()}</p>
                {remaining > 0 && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Còn cần {vndCompact(remaining)} ₫
                    </p>
                )}
            </div>
        </div>
    )
}
