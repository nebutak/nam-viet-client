import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { Download, Printer, Banknote, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

const cashflowData = [
    { month: 'T1', in: 120, out: 90, balance: 30 },
    { month: 'T2', in: 150, out: 110, balance: 70 },
    { month: 'T3', in: 180, out: 120, balance: 130 },
    { month: 'T4', in: 140, out: 130, balance: 140 },
    { month: 'T5', in: 200, out: 140, balance: 200 },
    { month: 'T6', in: 250, out: 160, balance: 290 },
]

const pnlData = [
    { category: 'Doanh thu Thuần', amount: 1040000000, type: 'revenue' },
    { category: 'Giá vốn Hàng bán', amount: -625000000, type: 'cost' },
    { category: 'Lợi nhuận Gộp', amount: 415000000, type: 'profit' },
    { category: 'Chi phí Bán hàng', amount: -120000000, type: 'cost' },
    { category: 'Chi phí Quản lý', amount: -85000000, type: 'cost' },
    { category: 'Chi phí Tài chính', amount: -15000000, type: 'cost' },
    { category: 'Lợi nhuận Thuần từ HĐKD', amount: 195000000, type: 'profit' },
    { category: 'Thu nhập khác', amount: 25000000, type: 'revenue' },
    { category: 'Lợi nhuận trước Thuế', amount: 220000000, type: 'profit' },
    { category: 'Thuế TNDN (20%)', amount: -44000000, type: 'cost' },
    { category: 'Lợi Nhuận Sau Thuế (Net Profit)', amount: 176000000, type: 'net' },
]

const FinancialReportPage = () => {
    const [dateRange, setDateRange] = useState('Năm nay')
    const reportRef = useRef(null)

    const handleExportPDF = () => {
        const element = reportRef.current
        const opt = {
            margin: 1,
            filename: 'Bao_Cao_Tai_Chinh.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }
        html2pdf().set(opt).from(element).save()
    }

    return (
        <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Báo Cáo Tài Chính (P&L)</h1>
                    <p className="text-muted-foreground mt-1">Phân tích dòng tiền và kết quả hoạt động kinh doanh (KQHĐKD)</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary mr-2"
                    >
                        <option>Quý 1</option>
                        <option>Quý 2</option>
                        <option>Năm nay</option>
                    </select>
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">In Báo Cáo</span>
                    </Button>
                    <Button className="flex items-center gap-2" onClick={handleExportPDF}>
                        <Download className="h-4 w-4" />
                        <span>Xuất PDF</span>
                    </Button>
                </div>
            </div>

            <div ref={reportRef} className="space-y-6 print:p-6 print:bg-white bg-transparent">
                {/* KPI Dòng Tiền */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dòng Tiền Vào (Inflow)</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">1,040,000,000 ₫</div>
                            <p className="text-xs text-muted-foreground mt-1">Thu từ bán hàng và CCDV</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dòng Tiền Ra (Outflow)</CardTitle>
                            <ArrowDownRight className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-500">-750,000,000 ₫</div>
                            <p className="text-xs text-muted-foreground mt-1">Chi trả NCC, Lương, CP Khác</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lưu Chuyển Tiền Thuần</CardTitle>
                            <RefreshCcw className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">290,000,000 ₫</div>
                            <p className="text-xs text-muted-foreground mt-1">Tiền mặt thặng dư</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Biểu Đồ Dòng Tiền */}
                <Card className="col-span-1 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Biểu Đồ Lưu Chuyển Tiền Tệ (6 Tháng Gần Nhất)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cashflowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tickFormatter={(val) => `${val}M`} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(val) => `${val},000,000 ₫`} />
                                    <Area type="monotone" dataKey="balance" name="Thặng dư lũy kế" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBalance)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Bảng báo cáo KQHĐKD (P&L) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Báo Cáo Kết Quả Hoạt Động Kinh Doanh (P&L)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left font-medium">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-md">Chỉ Tiêu</th>
                                        <th className="px-4 py-3 text-right">Số Tiền (VND)</th>
                                        <th className="px-4 py-3 text-right rounded-tr-md">% Doanh Thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pnlData.map((item, idx) => {
                                        const isProfit = item.type === 'profit'
                                        const isNet = item.type === 'net'
                                        const isCost = item.type === 'cost'
                                        const isRevenue = item.type === 'revenue'

                                        const percent = Math.abs((item.amount / pnlData[0].amount) * 100).toFixed(1)

                                        return (
                                            <tr
                                                key={idx}
                                                className={`border-b last:border-0 hover:bg-muted/30
                          ${isProfit ? 'bg-muted/10 font-bold' : ''}
                          ${isNet ? 'bg-primary/5 text-primary text-base font-bold' : ''}
                        `}
                                            >
                                                <td className={`px-4 py-3 
                            ${isCost ? 'pl-8 text-muted-foreground' : ''} 
                            ${isRevenue && !isProfit ? 'text-emerald-600' : ''}`
                                                }
                                                >
                                                    {item.category}
                                                </td>
                                                <td className={`px-4 py-3 text-right 
                            ${isCost ? 'text-rose-500' : ''}`
                                                }
                                                >
                                                    {new Intl.NumberFormat('vi-VN').format(item.amount)} ₫
                                                </td>
                                                <td className="px-4 py-3 text-right text-muted-foreground font-normal">
                                                    {isNet || isProfit || isCost ? `${percent}%` : '-'}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default FinancialReportPage
