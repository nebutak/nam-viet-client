import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, startOfMonth } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCustomerInvoices } from '@/stores/CustomerSlice'
import { useDispatch } from 'react-redux'

const CustomerRevenueChartTab = ({ customerId }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    if (!customerId) {
      setLoading(false)
      return
    }

    setLoading(true)

    dispatch(getCustomerInvoices({
      customerId,
      limit: 1000,
      page: 1,
      order: [['createdAt', 'DESC']],
    })).unwrap()
      .then((res) => {
        const invoices = res.invoices || []
        const map = new Map()

        invoices.forEach((inv) => {
          const monthKey = format(startOfMonth(new Date(inv.date)), 'yyyy-MM')
          const existing = map.get(monthKey) || { subTotal: 0, amount: 0 }
          existing.subTotal += inv.subTotal
          existing.amount += inv.amount
          map.set(monthKey, existing)
        })

        const sorted = Array.from(map.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, values]) => ({
            month: format(new Date(month + '-01'), 'MM/yyyy'),
            subTotal: values.subTotal,
            amount: values.amount,
          }))

        setData(sorted)
      })
      .catch((err) => {
        console.error('Lỗi tải biểu đồ:', err)
        setData([])
      })
      .finally(() => setLoading(false))
  }, [customerId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-muted-foreground">
          Không có dữ liệu doanh thu
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(v) => `${Number(v).toLocaleString()}đ`}
                labelFormatter={(l) => `Tháng ${l}`}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="subTotal"
                stroke="#3b82f6"
                name="Tạm tính"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                name="Thực thu"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerRevenueChartTab
