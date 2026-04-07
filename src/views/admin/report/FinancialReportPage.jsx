import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Layout, LayoutBody } from '@/components/custom/Layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '@/utils/axios'

// Import components
import FinancialFilters from './components/FinancialFilters'
import FinancialKPICards from './components/FinancialKPICards'
import FinancialCharts from './components/FinancialCharts'
import FinancialTopPartners from './components/FinancialTopPartners'

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value || 0)
}

const FinancialReportPage = () => {
    // Auth
    const authUser = useSelector((state) => state.auth?.authUserWithRoleHasPermissions)
    const isAdmin = authUser?.role?.roleKey === 'admin'

    // Calculate default date range (current month)
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const fromDate = firstDayOfMonth.toISOString().split('T')[0]
    const toDate = today.toISOString().split('T')[0]

    // State management
    const [filters, setFilters] = useState({
        fromDate,
        toDate
    })

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Opening Balance Edit Dialog state
    const [showOpeningBalanceDialog, setShowOpeningBalanceDialog] = useState(false)
    const [openingBalanceInput, setOpeningBalanceInput] = useState(0)
    const [savingOpeningBalance, setSavingOpeningBalance] = useState(false)

    // Fetch financial report data
    const fetchFinancialReport = async () => {
        try {
            setLoading(true)
            setError(null)

            const params = {
                fromDate: filters.fromDate,
                toDate: filters.toDate
            }

            const response = await api.get('/reports/financial', { params })

            if (response.data.success) {
                const reportData = response.data.data

                const validatedData = {
                    period: reportData.period || { fromDate: filters.fromDate, toDate: filters.toDate, days: 0 },
                    kpi: reportData.kpi || {
                        totalReceipts: 0,
                        totalPayments: 0,
                        netCashFlow: 0,
                        openingBalance: 0,
                        closingBalance: 0,
                        receiptGrowth: 0,
                        paymentGrowth: 0,
                        cashFlowGrowth: 0
                    },
                    kpiYearly: reportData.kpiYearly || {
                        year: today.getFullYear(),
                        openingBalance: 0,
                        totalReceipts: 0,
                        totalPayments: 0,
                        netCashFlow: 0,
                        closingBalance: 0
                    },
                    profitLoss: reportData.profitLoss || {
                        lines: [],
                        totalRevenue: 0,
                        totalExpenses: 0,
                        netProfit: 0
                    },
                    receiptsByType: reportData.receiptsByType || [],
                    paymentsByType: reportData.paymentsByType || [],
                    cashLedger: reportData.cashLedger || [],
                    topCustomers: reportData.topCustomers || [],
                    topSuppliers: reportData.topSuppliers || []
                }

                setData(validatedData)
                // Prefill opening balance input
                setOpeningBalanceInput(Number(reportData.kpiYearly?.openingBalance || 0))
            }
        } catch (err) {
            console.error('❌ Error fetching financial report:', err)
            setError(err.response?.data?.message || err.message || 'Lỗi khi tải báo cáo tài chính')
        } finally {
            setLoading(false)
        }
    }

    // Fetch data when filters change
    useEffect(() => {
        fetchFinancialReport()
    }, [filters.fromDate, filters.toDate])

    // Save opening balance
    const handleSaveOpeningBalance = async () => {
        try {
            setSavingOpeningBalance(true)
            const year = data?.kpiYearly?.year || today.getFullYear()
            await api.post('/reports/financial/yearly-fund', {
                year,
                openingBalance: Number(openingBalanceInput)
            })
            setShowOpeningBalanceDialog(false)
            await fetchFinancialReport()
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi lưu quỹ đầu năm')
        } finally {
            setSavingOpeningBalance(false)
        }
    }

    // Export to Excel
    const handleExport = async () => {
        try {
            const params = {
                fromDate: filters.fromDate,
                toDate: filters.toDate
            }

            const response = await api.get('/reports/financial/export', {
                params,
                responseType: 'blob'
            })

            const contentType = (response.headers?.['content-type'] || '').toLowerCase()
            const isExcel = contentType.includes('spreadsheet') || contentType.includes('octet-stream')
            if (!isExcel) {
                const text = await response.data.text()
                if (contentType.includes('application/json')) {
                    try {
                        const json = JSON.parse(text)
                        const msg = json?.message || json?.error?.message || 'Không thể xuất file Excel. Vui lòng thử lại.'
                        alert(msg)
                    } catch {
                        alert('Không thể xuất file Excel. Vui lòng thử lại.')
                    }
                } else {
                    alert('Không thể xuất file Excel. Máy chủ trả về dữ liệu không đúng định dạng.')
                }
                return
            }

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `BaoCaoTaiChinh_${filters.fromDate}_${filters.toDate}.xlsx`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Export error:', err)
            let message = 'Không thể xuất file Excel. Vui lòng thử lại.'
            if (err.response?.data instanceof Blob) {
                try {
                    const text = await err.response.data.text()
                    const json = JSON.parse(text)
                    message = json?.message || json?.error || message
                } catch (_) {}
            } else if (err.response?.data?.message) {
                message = err.response.data.message
            } else if (err.message) {
                message = err.message
            }
            alert(message)
        }
    }

    const kpiYearly = data?.kpiYearly

    return (
        <Layout>
            <LayoutBody className="flex flex-col overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Báo cáo Tài chính</h2>
                        <p className="text-muted-foreground">
                            Tổng quan tình hình tài chính doanh nghiệp
                        </p>
                    </div>
                    <Button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-white text-green-700 border-2 border-green-600 hover:bg-green-600 hover:text-white font-medium"
                    >
                        <Download className="h-4 w-4" />
                        Xuất Excel
                    </Button>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="font-semibold mb-1">Lỗi khi tải dữ liệu</div>
                            <div className="text-sm">{error}</div>
                            {error.includes('403') && (
                                <div className="text-sm mt-2">
                                    💡 Lỗi 403 Forbidden: Bạn chưa có quyền truy cập.
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Filters */}
                <FinancialFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    loading={loading}
                />

                {/* === TỔNG HỢP THEO NĂM — CHỈ ADMIN === */}
                {isAdmin && (
                    <div className="mb-2">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-base font-bold text-gray-800">
                                    📅 Tổng hợp theo năm {kpiYearly?.year || today.getFullYear()}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Tính từ 01/01/{kpiYearly?.year || today.getFullYear()} đến ngày hiện tại · Quỹ đầu kỳ do Admin thiết lập
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setOpeningBalanceInput(Number(kpiYearly?.openingBalance || 0))
                                    setShowOpeningBalanceDialog(true)
                                }}
                                className="text-purple-700 border-purple-300 hover:bg-purple-50"
                            >
                                ✏️ Sửa Quỹ đầu năm
                            </Button>
                        </div>
                        <FinancialKPICards
                            kpi={kpiYearly}
                            loading={loading}
                            isYearly={true}
                            onEditOpeningBalance={() => {
                                setOpeningBalanceInput(Number(kpiYearly?.openingBalance || 0))
                                setShowOpeningBalanceDialog(true)
                            }}
                        />
                    </div>
                )}

                {/* Divider */}
                {isAdmin && (
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-dashed border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-400">Tổng hợp theo kỳ lọc</span>
                        </div>
                    </div>
                )}

                {/* === TỔNG HỢP THEO KỲ LỌC — TẤT CẢ === */}
                <div className="mb-2">
                    {isAdmin && (
                        <div className="mb-3">
                            <h3 className="text-base font-bold text-gray-800">
                                📊 Tổng hợp theo kỳ lọc
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {filters.fromDate} → {filters.toDate} · Quỹ đầu kỳ = 0 (theo từng kỳ)
                            </p>
                        </div>
                    )}
                    <FinancialKPICards
                        kpi={data?.kpi}
                        loading={loading}
                        isYearly={false}
                    />
                </div>

                {/* Cash Flow Chart - Full Width */}
                <FinancialCharts
                    data={data}
                    isLoading={loading}
                />

                {/* Bottom Row: Top Partners (Left) + Expense Chart (Right) */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Top Partners - Takes 2 columns */}
                    <div className="md:col-span-2">
                        <FinancialTopPartners
                            data={data}
                            isLoading={loading}
                        />
                    </div>

                    {/* Expense Chart - Right side */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Cơ cấu chi phí</CardTitle>
                                <p className="text-sm text-muted-foreground">Phân bổ chi phí theo loại</p>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {data?.paymentsByType?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={data.paymentsByType}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="amount"
                                                nameKey="displayName"
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {data.paymentsByType.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#22c55e', '#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'][index % 6]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        Không có dữ liệu
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Opening Balance Dialog */}
                {showOpeningBalanceDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-bold mb-1">Cập nhật Quỹ đầu năm</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Năm {data?.kpiYearly?.year || today.getFullYear()} · Chỉ Admin mới có thể chỉnh sửa
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quỹ đầu kỳ (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    value={openingBalanceInput}
                                    onChange={(e) => setOpeningBalanceInput(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="Nhập số tiền quỹ đầu kỳ..."
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Giá trị này được cộng vào Tổng thu - Tổng chi để ra Tồn quỹ năm.
                                </p>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowOpeningBalanceDialog(false)}
                                    disabled={savingOpeningBalance}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSaveOpeningBalance}
                                    disabled={savingOpeningBalance}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    {savingOpeningBalance ? 'Đang lưu...' : 'Lưu'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </LayoutBody>
        </Layout>
    )
}

export default FinancialReportPage
