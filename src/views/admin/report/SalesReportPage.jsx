import { useState, useEffect } from 'react'
import { Layout, LayoutBody } from '@/components/custom/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/utils/axios'

// Import components
import RevenueKPICards from './components/RevenueKPICards'
import RevenueFilters from './components/RevenueFilters'
import RevenueCharts from './components/RevenueCharts'
import RevenueDataTables from './components/RevenueDataTables'

const SalesReportPage = () => {
    // Calculate default date range (last 30 days)
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // State management
    const [filters, setFilters] = useState({
        fromDate: thirtyDaysAgo,
        toDate: today,
        groupBy: 'day',
        warehouseId: null,
        salesChannel: null,
        customerId: null,
        createdBy: null,
        orderStatus: null
    })

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch sales report data
    const fetchSalesReport = async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('📡 Fetching sales report with filters:', filters)

            // Build query params
            const params = {
                fromDate: filters.fromDate,
                toDate: filters.toDate,
            }

            // Add optional filters if they exist
            if (filters.warehouseId) params.warehouseId = filters.warehouseId
            if (filters.salesChannel) params.salesChannel = filters.salesChannel
            if (filters.customerId) params.customerId = filters.customerId
            if (filters.createdBy) params.createdBy = filters.createdBy
            if (filters.orderStatus) params.orderStatus = filters.orderStatus

            const response = await api.get('/reports/sales', { params })

            console.log('✅ Sales report data:', response.data)

            if (response.data.success) {
                const reportData = response.data.data
                
                // Validate data structure
                if (!reportData) {
                    throw new Error('Dữ liệu trả về không hợp lệ')
                }

                // Add fallbacks for missing data
                const validatedData = {
                    period: reportData.period || { fromDate: filters.fromDate, toDate: filters.toDate, days: 0 },
                    summary: reportData.summary || {
                        netRevenue: 0,
                        netRevenueGrowth: 0,
                        estimatedProfit: 0,
                        profitMargin: 0,
                        totalOrders: 0,
                        cancelledOrders: 0,
                        completedOrders: 0,
                        newDebt: 0,
                        totalDebt: 0,
                        debtPercentage: 0
                    },
                    trends: reportData.trends || [],
                    byChannel: reportData.byChannel || [],
                    topProducts: reportData.topProducts || [],
                    staffPerformance: reportData.staffPerformance || [],
                    topCustomers: reportData.topCustomers || []
                }

                setData(validatedData)
                
                // Show appropriate message
                if (validatedData.summary.totalOrders === 0) {
                    toast.info('Không có dữ liệu trong khoảng thời gian này')
                } else {
                    toast.success(`Tải thành công ${validatedData.summary.totalOrders} đơn hàng`)
                }
            } else {
                throw new Error(response.data.message || 'Không thể tải dữ liệu')
            }
        } catch (err) {
            console.error('❌ Error fetching sales report:', err)
            const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        console.log('🔍 Filters changed:', newFilters)
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    // Fetch data when filters change
    useEffect(() => {
        fetchSalesReport()
    }, [filters.fromDate, filters.toDate, filters.warehouseId, filters.salesChannel, filters.customerId, filters.createdBy, filters.orderStatus])

    return (
        <Layout>
            <LayoutBody className="flex flex-col" fixedHeight>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Báo cáo Bán hàng</h2>
                        <p className="text-muted-foreground">
                            Phân tích hiệu quả bán hàng và khách hàng
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <RevenueFilters onFilterChange={handleFilterChange} />
                </div>

                {/* Error State */}
                {error && (
                    <Card className="mb-6 border-red-200 bg-red-50">
                        <CardContent className="flex items-center gap-2 py-4">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-sm text-red-600">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* KPI Cards */}
                <div className="mb-6">
                    <RevenueKPICards data={data} isLoading={loading} />
                </div>

                {/* Charts */}
                <div className="mb-6">
                    <RevenueCharts data={data} isLoading={loading} />
                </div>

                {/* Data Tables */}
                <div className="mb-6">
                    <RevenueDataTables data={data} isLoading={loading} />
                </div>

                {/* Debug Info (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <Card className="mt-4 border-blue-200 bg-blue-50">
                        <CardContent className="py-4">
                            <div className="space-y-2">
                                <p className="text-xs font-mono text-blue-800">
                                    🔧 Debug Info:
                                </p>
                                <p className="text-xs font-mono text-blue-800">
                                    Filters: {JSON.stringify(filters, null, 2)}
                                </p>
                                <p className="text-xs font-mono text-blue-800">
                                    Loading: {loading ? 'Yes' : 'No'}
                                </p>
                                <p className="text-xs font-mono text-blue-800">
                                    Has Data: {data ? 'Yes' : 'No'}
                                </p>
                                {data && (
                                    <p className="text-xs font-mono text-blue-800">
                                        Total Orders: {data.summary?.totalOrders || 0}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </LayoutBody>
        </Layout>
    )
}

export default SalesReportPage
