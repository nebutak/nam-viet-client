import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Package, Users } from 'lucide-react'

const RevenueDataTables = ({ data, isLoading = false }) => {
    const [activeTab, setActiveTab] = useState('orders')

    if (isLoading) {
        return (
            <div className="h-64 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
        )
    }

    if (!data) return null

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0)
    }

    const formatNumber = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value || 0)
    }

    const formatPercentage = (value) => {
        return `${(value || 0).toFixed(1)}%`
    }

    const tabs = [
        { 
            id: 'orders', 
            label: 'Chi tiết theo Đơn hàng', 
            count: data.orders?.length || 0,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        { 
            id: 'products', 
            label: 'Chi tiết theo Sản phẩm', 
            count: data.productPerformance?.length || 0,
            icon: Package,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        { 
            id: 'customers', 
            label: 'Chi tiết theo Khách hàng', 
            count: data.customerAnalysis?.length || 0,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ]

    const getPaymentStatusLabel = (status) => {
        switch (status) {
            case 'paid': return 'Đã thanh toán'
            case 'partial': return 'Thanh toán một phần'
            case 'unpaid': return 'Chưa thanh toán'
            default: return status
        }
    }

    const getPaymentStatusClass = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'partial':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'unpaid':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-0">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-green-600 text-green-600 bg-white dark:bg-gray-800 dark:text-green-500'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id ? tab.bgColor + ' ' + tab.color : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6 dark:bg-gray-800">{/* Rest of the code remains the same */}
                    {/* Tab 1: Orders */}
                    {activeTab === 'orders' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Mã đơn
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Ngày bán
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Khách hàng
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Nhân viên
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Tổng tiền
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Giảm giá
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Thành tiền
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Thanh toán
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {data.orders?.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {order.orderCode}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {order.customerName}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {order.staffName || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                                {formatCurrency(order.discountAmount)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(order.finalAmount)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusClass(order.paymentStatus)}`}>
                                                    {getPaymentStatusLabel(order.paymentStatus)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!data.orders || data.orders.length === 0) && (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    Không có dữ liệu đơn hàng
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Products */}
                    {activeTab === 'products' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Mã SKU
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Tên sản phẩm
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Đơn vị
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Số lượng
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Doanh số
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Tỷ trọng
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {data.productPerformance?.map((product) => (
                                        <tr key={product.productId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {product.sku}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {product.productName}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                                                {product.unit?.unitName || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                                                {formatNumber(product.quantity)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(product.revenue)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                                {formatPercentage(product.percentage)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!data.productPerformance || data.productPerformance.length === 0) && (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    Không có dữ liệu sản phẩm
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Customers */}
                    {activeTab === 'customers' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Mã khách
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Tên khách hàng
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Số đơn
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Tổng doanh số
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Công nợ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {data.customerAnalysis?.map((customer) => (
                                        <tr key={customer.customerId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {customer.customerCode}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {customer.customerName}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                                                {formatNumber(customer.orderCount)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(customer.totalRevenue)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                                <span className={customer.currentDebt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                                                    {formatCurrency(customer.currentDebt)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!data.customerAnalysis || data.customerAnalysis.length === 0) && (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    Không có dữ liệu khách hàng
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default RevenueDataTables
