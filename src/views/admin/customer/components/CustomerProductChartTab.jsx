import { getCustomerPurchasedProducts } from '@/stores/CustomerSlice'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const COLORS = [
  '#6366F1',
  '#22C55E',
  '#F97316',
  '#EC4899',
  '#06B6D4',
  '#EAB308',
  '#8B5CF6',
  '#F97373',
  '#10B981',
  '#3B82F6',
]

const CustomerProductChartTab = ({ customerId }) => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!customerId) return
    setLoading(true)
    dispatch(getCustomerPurchasedProducts({ customerId })).unwrap()
      .then((res) => {
        setData(Array.isArray(res) ? res : [])
      })
      .catch(() => {
        setData([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [customerId])

  if (!customerId) {
    return (
      <div className="text-sm text-muted-foreground">
        Không có thông tin khách hàng.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Đang tải dữ liệu...</div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Khách hàng chưa có dữ liệu mua sản phẩm.
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.productName || `SP #${item.productId}`,
    value: Number(item.totalQuantity || 0),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Biểu đồ sản phẩm khách đã mua</h2>
        <span className="text-xs text-muted-foreground">
          Đơn vị: số lượng sản phẩm
        </span>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CustomerProductChartTab
