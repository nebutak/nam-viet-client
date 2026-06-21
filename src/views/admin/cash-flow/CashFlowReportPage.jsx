import { Layout, LayoutBody } from '@/components/custom/Layout'
import { useEffect, useState, useRef, useCallback } from 'react'
import { moneyFormat } from '@/utils/money-format'
import api from '@/utils/axios'
import { format, startOfMonth, endOfMonth, addHours, startOfDay, endOfDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { DateRange } from '@/components/custom/DateRange'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/Button'
import { Printer, Search, RefreshCcw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import PrintCashFlowReport from './components/PrintCashFlowReport'

const CashFlowReportPage = () => {
  const [data, setData] = useState([])
  const [summary, setSummary] = useState({ openingBalance: 0, totalIn: 0, totalOut: 0, endingBalance: 0 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [showPrint, setShowPrint] = useState(false)
  const printRef = useRef()

  const current = new Date()
  const [filters, setFilters] = useState({
    fromDate: addHours(startOfDay(startOfMonth(current)), 12),
    toDate: addHours(endOfDay(endOfMonth(current)), 0),
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        fromDate: filters.fromDate ? format(filters.fromDate, 'yyyy-MM-dd') : undefined,
        toDate: filters.toDate ? format(filters.toDate, 'yyyy-MM-dd') : undefined,
      }
      if (keyword) params.keyword = keyword

      const response = await api.get('/cash-flow', { params })
      setData(response.data.data || [])
      setSummary(response.data.summary || { openingBalance: 0, totalIn: 0, totalOut: 0, endingBalance: 0 })
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu sổ quỹ:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, keyword])

  useEffect(() => {
    document.title = 'Báo cáo thu chi'
    fetchData()
  }, [fetchData])

  const handleSearch = () => {
    setKeyword(searchInput)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handlePrint = () => {
    setShowPrint(true)
    setTimeout(() => {
      if (printRef.current) {
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
          <html>
            <head>
              <title>Báo cáo thu chi</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Times New Roman', serif; font-size: 13px; color: #000; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
                th { background: #e8e8e8; font-weight: bold; text-align: center; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .header { text-align: center; margin-bottom: 16px; }
                .header h1 { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
                .header p { font-size: 14px; }
                .summary-cards { display: flex; gap: 24px; justify-content: center; margin: 16px 0; }
                .summary-card { text-align: center; min-width: 150px; }
                .summary-card .label { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
                .summary-card .value { font-size: 16px; font-weight: bold; }
                .text-green { color: #16a34a; }
                .text-red { color: #dc2626; }
                .text-blue { color: #2563eb; }
                .print-time { text-align: right; font-size: 12px; margin-bottom: 8px; }
                .page-number { text-align: right; font-size: 11px; margin-top: 8px; }
                .opening-bg { background: #dcfce7; }
                @media print { @page { size: landscape; margin: 10mm; } }
              </style>
            </head>
            <body>${printRef.current.innerHTML}</body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
      setShowPrint(false)
    }, 300)
  }

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: vi })
    } catch {
      return dateStr
    }
  }

  const SummaryCard = ({ label, value, color }) => (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold mt-1 ${color}`}>{moneyFormat(value)} đ</p>
    </div>
  )

  return (
    <Layout>
      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Báo cáo thu chi</h2>
            <p className="text-sm text-muted-foreground">Sổ quỹ tiền mặt - Tổng hợp phiếu thu, phiếu chi</p>
          </div>
          <div className="flex items-center gap-2">
            <DateRange
              defaultValue={{
                from: filters?.fromDate,
                to: filters?.toDate,
              }}
              onChange={(range) => {
                setFilters({
                  fromDate: range?.from
                    ? addHours(startOfDay(range.from), 12)
                    : addHours(startOfDay(startOfMonth(current)), 12),
                  toDate: range?.to
                    ? addHours(endOfDay(range.to), 0)
                    : addHours(endOfDay(endOfMonth(current)), 0),
                })
              }}
            />
            <Button variant="outline" size="icon" onClick={fetchData} title="Làm mới">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-4">
          <SummaryCard label="Quỹ đầu kỳ" value={summary.openingBalance} color="text-blue-600" />
          <SummaryCard label="Tổng thu" value={summary.totalIn} color="text-green-600" />
          <SummaryCard label="Tổng chi" value={summary.totalOut} color="text-red-600" />
          <SummaryCard label="Tồn quỹ" value={summary.endingBalance} color="text-primary" />
        </div>

        {/* Search + Print */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Tìm theo tên, SĐT, mã phiếu..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-w-xs"
            />
            <Button variant="outline" size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-1" /> Tìm
            </Button>
          </div>
          <Button variant="default" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Báo cáo thu chi
          </Button>
        </div>

        {/* Data Table */}
        <div className="-mx-4 flex-1 overflow-auto px-1 sm:px-4 py-1">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-3 py-2.5 text-left font-semibold w-12">STT</th>
                    <th className="px-3 py-2.5 text-left font-semibold min-w-[120px]">Mã</th>
                    <th className="px-3 py-2.5 text-left font-semibold min-w-[130px]">Phiếu ngày</th>
                    <th className="px-3 py-2.5 text-left font-semibold min-w-[120px]">Loại</th>
                    <th className="px-3 py-2.5 text-left font-semibold min-w-[180px]">NCC/Khách hàng</th>
                    <th className="px-3 py-2.5 text-left font-semibold min-w-[150px]">Địa chỉ</th>
                    <th className="px-3 py-2.5 text-left font-semibold min-w-[220px]">Nội dung</th>
                    <th className="px-3 py-2.5 text-right font-semibold min-w-[120px]">Giá trị</th>
                    <th className="px-3 py-2.5 text-left font-semibold min-w-[120px]">NV nộp tiền</th>
                    <th className="px-3 py-2.5 text-right font-semibold min-w-[140px]">Tồn quỹ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-muted-foreground">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-t hover:bg-muted/30 transition-colors ${
                          item.isOpeningBalance ? 'bg-green-50 dark:bg-green-950/20' : ''
                        }`}
                      >
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">
                          <span className={`font-medium ${item.type === 'receipt' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.code}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground text-xs">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            item.isOpeningBalance
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : item.type === 'receipt'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}>
                            {item.typeLabel}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-medium">{item.partnerName || '—'}</div>
                          {item.phone && (
                            <div className="text-xs text-muted-foreground">📞 {item.phone}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground max-w-[180px] truncate">
                          {item.address || '—'}
                        </td>
                        <td className="px-3 py-2">
                          {item.isOpeningBalance ? (
                            <div className="inline-flex items-center rounded px-2 py-1 bg-green-100 dark:bg-green-900/40">
                              <span className="font-bold text-green-700 dark:text-green-300 text-xs uppercase">
                                THU ĐẦU KỲ
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs">
                              <div className="font-semibold uppercase">{item.typeLabel}</div>
                              <div className="text-muted-foreground line-clamp-2">{item.content}</div>
                            </div>
                          )}
                        </td>
                        <td className={`px-3 py-2 text-right font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.amount >= 0 ? '+' : ''}{moneyFormat(item.amount)}
                        </td>
                        <td className="px-3 py-2 text-xs">{item.submitter || '—'}</td>
                        <td className="px-3 py-2 text-right font-bold text-primary">
                          {moneyFormat(item.runningBalance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hidden Print Component */}
        {showPrint && (
          <div className="hidden">
            <div ref={printRef}>
              <PrintCashFlowReport
                data={data}
                summary={summary}
                fromDate={filters.fromDate ? format(filters.fromDate, 'dd/MM/yyyy') : ''}
                toDate={filters.toDate ? format(filters.toDate, 'dd/MM/yyyy') : ''}
              />
            </div>
          </div>
        )}
      </LayoutBody>
    </Layout>
  )
}

export default CashFlowReportPage
