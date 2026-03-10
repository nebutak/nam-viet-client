import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const InventoryCharts = ({ data, isLoading = false }) => {
  if (isLoading || !data) return null

  // Prepare category data for charts
  const categoryData = (data.byCategory || []).map((item) => ({
    name: item.category,
    value: item.value,
    quantity: item.quantity,
    itemCount: item.itemCount,
  }))

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm text-blue-600">
            Giá trị: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Số lượng: {payload[0].payload.quantity.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Sản phẩm: {payload[0].payload.itemCount}
          </p>
        </div>
      )
    }
    return null
  }

  const BarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="text-sm font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm text-blue-600">
            Số lượng: {payload[0].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Pie Chart: Value by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bổ theo loại</CardTitle>
          <p className="text-sm text-muted-foreground">Tồn kho theo loại sản phẩm</p>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Category Table */}
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Loại</th>
                      <th className="px-3 py-2 text-right">Giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2 flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          {item.name}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {formatCurrency(item.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart: Quantity by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Số lượng theo loại</CardTitle>
          <p className="text-sm text-muted-foreground">So sánh số lượng tồn kho</p>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                    return value
                  }}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend />
                <Bar dataKey="quantity" fill="#3B82F6" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryCharts
