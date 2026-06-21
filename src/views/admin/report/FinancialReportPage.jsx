import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Layout, LayoutBody } from '@/components/custom/Layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import api from '@/utils/axios'

// Components
import FinancialFilters from './components/FinancialFilters'
import FinancialKPICards from './components/FinancialKPICards'
import FinancialCharts from './components/FinancialCharts'
import FinancialTopPartners from './components/FinancialTopPartners'
import FinancialLedgerTable from './components/FinancialLedgerTable'
import ExportFinancialLedgerPreviewDialog from './components/ExportFinancialLedgerPreviewDialog'
import ExportExcelDialog from './components/ExportExcelDialog'

const formatCurrency = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v || 0)

const FinancialReportPage = () => {
  // Auth
  const authUser = useSelector((state) => state.auth?.authUserWithRoleHasPermissions)
  const isAdmin = authUser?.role?.roleKey === 'admin'

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // ── Filters state ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    fromDate: firstDayOfMonth.toISOString().split('T')[0],
    toDate: today.toISOString().split('T')[0],
  })

  // ── Cash book pagination ───────────────────────────────────────────────────
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // ── Data states ────────────────────────────────────────────────────────────
  const [data, setData] = useState(null)            // financial summary API result
  const [cashBook, setCashBook] = useState(null)    // cash-book API result
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Opening Balance Edit Dialog state
  const [showOpeningBalanceDialog, setShowOpeningBalanceDialog] = useState(false)
  const [openingBalanceInput, setOpeningBalanceInput] = useState(0)
  const [savingOpeningBalance, setSavingOpeningBalance] = useState(false)

  const [isPreviewPrintOpen, setIsPreviewPrintOpen] = useState(false)
  const [isExcelDialogOpen, setIsExcelDialogOpen]   = useState(false)

  // Fetch financial summary report (old/general API)
  const fetchFinancialReport = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/reports/financial', {
        params: {
          fromDate: filters.fromDate,
          toDate: filters.toDate
        }
      })
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
        setOpeningBalanceInput(Number(reportData.kpiYearly?.openingBalance || 0))
      }
    } catch (err) {
      console.error('❌ Error fetching financial report:', err)
      setError(err.response?.data?.message || err.message || 'Lỗi khi tải báo cáo tài chính')
    } finally {
      setLoading(false)
    }
  }, [filters.fromDate, filters.toDate])

  // Fetch cash-book ledger report
  const fetchCashBook = useCallback(async (currentFilters, currentPage, currentPageSize) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        fromDate: currentFilters.fromDate,
        toDate: currentFilters.toDate,
        page: currentPage,
        pageSize: currentPageSize,
      }
      if (currentFilters.customerId) params.customerId = currentFilters.customerId
      if (currentFilters.supplierId) params.supplierId = currentFilters.supplierId
      if (currentFilters.createdById) params.createdById = currentFilters.createdById
      if (currentFilters.receiverName) params.receiverName = currentFilters.receiverName
      if (currentFilters.receiverTypes) params.receiverTypes = currentFilters.receiverTypes
      if (currentFilters.voucherType) params.voucherType = currentFilters.voucherType

      const res = await api.get('/reports/financial/cash-book', { params })
      if (res.data.success) {
        setCashBook(res.data.data)
      }
    } catch (err) {
      console.error('❌ Cash book fetch error:', err)
      setError(err.response?.data?.message || err.message || 'Lỗi khi tải sổ quỹ')
    } finally {
      setLoading(false)
    }
  }, [])

  // Trigger fetches when filters or page changes
  useEffect(() => {
    fetchCashBook(filters, page, pageSize)
  }, [filters, page, pageSize, fetchCashBook])

  useEffect(() => {
    fetchFinancialReport()
  }, [filters.fromDate, filters.toDate, fetchFinancialReport])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

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
        } catch (_) { }
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
      <LayoutBody className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-6 h-[calc(100vh-var(--header-height))] pb-10">
        
        {/* Print Preview Dialog */}
        <ExportFinancialLedgerPreviewDialog
          isOpen={isPreviewPrintOpen}
          onClose={() => setIsPreviewPrintOpen(false)}
          filters={filters}
        />

        {/* Excel Export Dialog */}
        <ExportExcelDialog
          isOpen={isExcelDialogOpen}
          onClose={() => setIsExcelDialogOpen(false)}
        />

        {/* Page header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Báo cáo Tài chính</h2>
            <p className="text-muted-foreground text-sm">Sổ quỹ & tổng quan tình hình tài chính</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewPrintOpen(true)}
              className="flex items-center gap-2 bg-white text-indigo-700 border-2 border-indigo-500 hover:bg-indigo-600 hover:text-white font-medium"
            >
              <Printer className="h-4 w-4" />
              In sổ quỹ
            </Button>
            <Button
              type="button"
              onClick={() => setIsExcelDialogOpen(true)}
              className="flex items-center gap-2 bg-white text-green-700 border-2 border-green-600 hover:bg-green-600 hover:text-white font-medium"
            >
              <Download className="h-4 w-4" />
              Xuất Excel Sổ quỹ
            </Button>
            <Button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white font-medium"
            >
              <Download className="h-4 w-4" />
              Xuất Excel Báo cáo
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">Lỗi khi tải dữ liệu</div>
              <div className="text-sm">{error}</div>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <FinancialFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* === TỔNG HỢP THEO NĂM — CHỈ ADMIN === */}
        {isAdmin && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-white">
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
                className="text-purple-700 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-950 flex items-center gap-1"
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-gray-400 font-semibold">Sổ quỹ & Tổng hợp theo kỳ lọc</span>
            </div>
          </div>
        )}

        {/* === TỔNG HỢP THEO KỲ LỌC — TẤT CẢ === */}
        <div className="mb-6">
          {isAdmin && (
            <div className="mb-3">
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                📊 Tổng hợp theo kỳ lọc
              </h3>
              <p className="text-xs text-muted-foreground">
                {filters.fromDate} → {filters.toDate}
              </p>
            </div>
          )}
          <FinancialKPICards
            openingBalance={cashBook?.openingBalance}
            totalReceipt={cashBook?.totalReceipt}
            totalPayment={cashBook?.totalPayment}
            closingBalance={cashBook?.closingBalance}
            loading={loading}
          />
        </div>

        {/* Sổ quỹ chi tiết */}
        <div className="flex-1 mt-4 mb-8">
          <FinancialLedgerTable
            data={cashBook}
            loading={loading}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(ps) => { setPageSize(ps); setPage(1) }}
          />
        </div>

        {/* Charts */}
        <div className="mb-6">
          <FinancialCharts
            data={data}
            isLoading={loading}
          />
        </div>

        {/* Bottom Row: Top Partners + Expense Pie */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="md:col-span-2">
            <FinancialTopPartners
              data={data}
              isLoading={loading}
            />
          </div>
          <div className="md:col-span-1">
            <Card className="border-0 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Cơ cấu chi phí</CardTitle>
                <p className="text-sm text-muted-foreground">Phân bổ chi phí theo loại</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                {data?.paymentsByType?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={data.paymentsByType}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        paddingAngle={2}
                        dataKey="amount"
                        nameKey="displayName"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {data.paymentsByType.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#22c55e', '#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'][index % 6]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                    Không có dữ liệu
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Opening Balance Dialog */}
        {showOpeningBalanceDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border dark:border-gray-700">
              <h3 className="text-lg font-bold mb-1 dark:text-white">Cập nhật Quỹ đầu năm</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Năm {data?.kpiYearly?.year || today.getFullYear()} · Chỉ Admin mới có thể chỉnh sửa
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quỹ đầu kỳ (VNĐ)
                </label>
                <input
                  type="number"
                  value={openingBalanceInput}
                  onChange={(e) => setOpeningBalanceInput(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Nhập số tiền quỹ đầu kỳ..."
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
