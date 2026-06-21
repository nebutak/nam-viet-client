import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, PieChart, Edit2, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const formatCurrency = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v || 0)

const moneyFmt = formatCurrency

const KPICard = ({ label, value, icon: Icon, color, bgColor, description, loading, action }) => (
  <Card className="border-0 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
    <CardContent className="p-5">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <div className="flex items-center flex-wrap">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              {action}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={`h-11 w-11 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0 ml-2`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)

const FinancialKPICards = ({
  title,
  kpi,
  loading = false,
  isYearly = false,
  onEditOpeningBalance,
  openingBalance,
  totalReceipt,
  totalPayment,
  closingBalance,
}) => {
  const hasKpiObj = !!kpi
  const oBalance = hasKpiObj ? (kpi.openingBalance ?? 0) : (openingBalance ?? 0)
  const tReceipt = hasKpiObj ? (kpi.totalReceipts ?? kpi.totalReceipt ?? 0) : (totalReceipt ?? 0)
  const tPayment = hasKpiObj ? (kpi.totalPayments ?? kpi.totalPayment ?? 0) : (totalPayment ?? 0)
  const cBalance = hasKpiObj ? (kpi.closingBalance ?? 0) : (closingBalance ?? 0)
  const netFlow = hasKpiObj ? (kpi.netCashFlow ?? (tReceipt - tPayment)) : (tReceipt - tPayment)
  const profitMargin = tReceipt > 0 ? ((netFlow / tReceipt) * 100).toFixed(1) : '0.0'

  let cards = []

  if (isYearly) {
    cards = [
      {
        label: 'Quỹ đầu kỳ',
        value: formatCurrency(oBalance),
        icon: Wallet,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        description: 'Admin thiết lập',
        action: onEditOpeningBalance ? (
          <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 p-0 hover:bg-purple-200 dark:hover:bg-purple-800" onClick={onEditOpeningBalance}>
            <Edit2 className="h-3 w-3" />
          </Button>
        ) : null,
      },
      {
        label: 'Tổng thu năm',
        value: formatCurrency(tReceipt),
        icon: TrendingUp,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        description: 'Phiếu thu trong năm',
      },
      {
        label: 'Tổng chi năm',
        value: formatCurrency(tPayment),
        icon: TrendingDown,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        description: 'Phiếu chi trong năm',
      },
      {
        label: 'Tồn quỹ năm',
        value: formatCurrency(cBalance),
        icon: Wallet,
        color: cBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400',
        bgColor: cBalance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30',
        description: 'Đầu kỳ + Tổng thu - Tổng chi',
      },
    ]
  } else if (hasKpiObj) {
    // HEAD style for period filter
    const receiptGrowth = kpi.receiptGrowth ?? 0
    const paymentGrowth = kpi.paymentGrowth ?? 0
    const cashFlowGrowth = kpi.cashFlowGrowth ?? 0

    cards = [
      {
        label: 'Tổng thu',
        value: formatCurrency(tReceipt),
        icon: TrendingUp,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        description: receiptGrowth > 0 ? `+${receiptGrowth.toFixed(1)}% so với kỳ trước` : `${receiptGrowth.toFixed(1)}% so với kỳ trước`,
      },
      {
        label: 'Tổng chi',
        value: formatCurrency(tPayment),
        icon: TrendingDown,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        description: paymentGrowth > 0 ? `+${paymentGrowth.toFixed(1)}% so với kỳ trước` : `${paymentGrowth.toFixed(1)}% so với kỳ trước`,
      },
      {
        label: 'Tồn quỹ kỳ này (Thu - Chi)',
        value: formatCurrency(netFlow),
        icon: Wallet,
        color: netFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400',
        bgColor: netFlow >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30',
        description: cashFlowGrowth > 0 ? `+${cashFlowGrowth.toFixed(1)}% so với kỳ trước` : `${cashFlowGrowth.toFixed(1)}% so với kỳ trước`,
      },
      {
        label: 'Tỷ suất (Thu - Chi)/Thu',
        value: `${profitMargin}%`,
        icon: PieChart,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        description: 'Tồn quỹ trong kỳ / Tổng thu',
      },
    ]
  } else {
    // vanquy style for cash-book
    cards = [
      {
        label: 'Quỹ đầu kỳ',
        value: formatCurrency(oBalance),
        icon: Wallet,
        color: 'text-slate-700 dark:text-slate-300',
        bgColor: 'bg-slate-100 dark:bg-slate-800',
        description: 'Số dư trước kỳ báo cáo',
      },
      {
        label: 'Tổng thu',
        value: formatCurrency(tReceipt),
        icon: TrendingUp,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
        description: 'Tổng phiếu thu trong kỳ',
      },
      {
        label: 'Tổng chi',
        value: formatCurrency(tPayment),
        icon: TrendingDown,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50 dark:bg-rose-900/30',
        description: 'Tổng phiếu chi trong kỳ',
      },
      {
        label: 'Tồn quỹ hiện tại',
        value: formatCurrency(cBalance),
        icon: DollarSign,
        color: cBalance >= 0 ? 'text-blue-600' : 'text-rose-600',
        bgColor: cBalance >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-rose-50 dark:bg-rose-900/30',
        description: 'Quỹ đầu kỳ + Thu - Chi',
      },
    ]
  }

  return (
    <div className="mb-6">
      {title && <h3 className="text-lg font-bold mb-3">{title}</h3>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {cards.map((card, idx) => (
          <KPICard key={card.label || idx} {...card} loading={loading} />
        ))}
      </div>
    </div>
  )
}

export default FinancialKPICards
