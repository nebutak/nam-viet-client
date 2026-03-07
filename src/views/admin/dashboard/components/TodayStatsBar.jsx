import React from 'react'
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const vndCompact = (v) =>
    new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(v || 0))

const StatItem = ({ icon: Icon, label, value, sub, color, trend }) => (
    <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3 group">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-sm font-bold text-foreground leading-tight">{value}</p>
            {sub !== undefined && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    {trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    ) : trend === 'down' ? (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                    ) : null}
                    {sub}
                </p>
            )}
        </div>
    </div>
)

export const TodayStatsBar = ({ stats, loading }) => {
    const kpi = stats?.kpi

    if (loading && !stats) {
        return (
            <div className="w-full bg-card border rounded-xl flex items-center gap-0 divide-x divide-border mb-6 animate-pulse h-16" />
        )
    }

    const revenue = kpi?.revenue?.current || 0
    const prevRevenue = kpi?.revenue?.previous || 0
    const growth = kpi?.revenue?.growth_percent || 0

    const orders = kpi?.orders?.current || 0
    const pendingOrders = kpi?.orders?.pending || 0

    const debt = kpi?.debt?.receivables || 0
    const overdueCount = kpi?.debt?.overdue_count || 0

    const production = kpi?.production?.active || 0

    return (
        <div className="w-full bg-card border rounded-xl flex items-center divide-x divide-border mb-6 shadow-sm overflow-x-auto">
            <StatItem
                icon={TrendingUp}
                label="Doanh thu kỳ này"
                value={`${vndCompact(revenue)} ₫`}
                sub={`${growth >= 0 ? '+' : ''}${growth}% so kỳ trước`}
                trend={growth >= 0 ? 'up' : 'down'}
                color="bg-blue-500"
            />
            <StatItem
                icon={ShoppingBag}
                label="Tổng đơn hàng"
                value={new Intl.NumberFormat('vi-VN').format(orders)}
                sub={`${pendingOrders} đơn chờ duyệt`}
                trend={pendingOrders > 0 ? 'down' : 'up'}
                color="bg-indigo-500"
            />
            <StatItem
                icon={Users}
                label="Công nợ phải thu"
                value={`${vndCompact(debt)} ₫`}
                sub={`${overdueCount} khoản quá hạn`}
                trend={overdueCount > 0 ? 'down' : 'up'}
                color="bg-orange-500"
            />
            <StatItem
                icon={Package}
                label="Lệnh SX đang chạy"
                value={production}
                sub="đang hoạt động"
                color="bg-emerald-500"
            />
        </div>
    )
}
