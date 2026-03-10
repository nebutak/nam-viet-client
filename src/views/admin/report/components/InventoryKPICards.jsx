import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Archive, Package, AlertTriangle, TrendingUp } from 'lucide-react'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

const InventoryKPICards = ({ summary, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg border bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Đang tải...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalValue = Number(summary.totalValue || 0)
  const totalItems = Number(summary.totalItems || 0)
  const lowStockItems = Number(summary.lowStockItems || 0)
  const totalQuantity = Number(summary.totalQuantity || 0)

  const cards = [
    {
      title: 'Tổng giá trị tồn kho',
      value: formatCurrency(totalValue),
      icon: Archive,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      subText: 'Tính theo giá nhập',
    },
    {
      title: 'Số lượng sản phẩm',
      value: formatNumber(totalItems),
      icon: Package,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      subText: 'Tổng số SKU trong kho',
    },
    {
      title: 'Cảnh báo tồn kho',
      value: formatNumber(lowStockItems),
      icon: AlertTriangle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      subText: 'Sản phẩm dưới mức tối thiểu',
      valueColor: lowStockItems > 0 ? 'text-orange-600' : 'text-gray-900 dark:text-white',
    },
    {
      title: 'Tổng số lượng',
      value: formatNumber(totalQuantity),
      icon: TrendingUp,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      subText: 'Tổng số lượng khả dụng',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 dark:bg-gray-800 dark:border-gray-700"
            style={{ borderLeftColor: card.iconColor.replace('text-', '#') }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor} dark:bg-opacity-20 transition-transform duration-300 hover:scale-110`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.valueColor || 'text-gray-900 dark:text-white'}`}>
                {card.value}
              </div>
              {card.subText && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {card.subText}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default InventoryKPICards
