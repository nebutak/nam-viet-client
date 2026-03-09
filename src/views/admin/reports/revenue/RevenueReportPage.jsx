import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { Download, Printer, Filter, DollarSign, TrendingUp, Package, Calendar as CalendarIcon } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

const revenueData = [
    { month: 'Thg 1', revenue: 120000000, profit: 45000000 },
    { month: 'Thg 2', revenue: 150000000, profit: 55000000 },
    { month: 'Thg 3', revenue: 180000000, profit: 70000000 },
    { month: 'Thg 4', revenue: 140000000, profit: 50000000 },
    { month: 'Thg 5', revenue: 200000000, profit: 85000000 },
    { month: 'Thg 6', revenue: 250000000, profit: 110000000 },
]

const recentTransactions = [
    { id: 'INV-001', date: '07/03/2026', customer: 'Nguyễn Văn A', amount: 1500000, cost: 1000000, profit: 500000 },
    { id: 'INV-002', date: '06/03/2026', customer: 'Công tỷ ABC', amount: 12000000, cost: 8000000, profit: 4000000 },
    { id: 'INV-003', date: '06/03/2026', customer: 'Trần Thị B', amount: 800000, cost: 500000, profit: 300000 },
    { id: 'INV-004', date: '05/03/2026', customer: 'Lê Văn C', amount: 2500000, cost: 1800000, profit: 700000 },
]

const RevenueReportPage = () => {
    const [dateRange, setDateRange] = useState('Tháng này')
    const reportRef = useRef(null)

    const handleExportPDF = () => {
        const element = reportRef.current
        const opt = {
            margin: 1,
            filename: 'Bao_Cao_Doanh_Thu.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }
        html2pdf().set(opt).from(element).save()
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Báo Cáo Doanh Thu & Lợi Nhuận</h1>
                    <p className="text-muted-foreground mt-1">Phân tích chi tiết doanh thu, chi phí và lợi nhuận gộp</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md mr-2 bg-background">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-transparent border-none text-sm focus:outline-none"
                        >
                            <option>Hôm nay</option>
                            <option>Tuần này</option>
                            <option>Tháng này</option>
                            <option>Năm nay</option>
                        </select>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">In Báo Cáo</span>
                    </Button>
                    <Button className="flex items-center gap-2" onClick={handleExportPDF}>
                        <Download className="h-4 w-4" />
                        <span>Xuất PDF</span>
                    </Button>
                </div>
            </div>

            {/* Report Content to be Exported */}
            <div ref={reportRef} className="space-y-6 print:p-6 print:bg-white bg-transparent">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">1,040,000,000 ₫</div>
                            <p className="text-xs text-muted-foreground mt-1">+20.1% so với tháng trước</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lợi Nhuận Gộp</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">415,000,000 ₫</div>
                            <p className="text-xs text-muted-foreground mt-1">Biên lợi nhuận: 39.9%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Số Đơn Hàng</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,245</div>
                            <p className="text-xs text-muted-foreground mt-1">+15% so với tháng trước</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">GTTB / Đơn Hàng</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">835,340 ₫</div>
                            <p className="text-xs text-muted-foreground mt-1">+2.4% so với tháng trước</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Section */}
                <Card className="col-span-1 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Phân Tích Doanh Thu & Lợi Nhuận Gộp (6 Tháng)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000000}M`} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Doanh Thu" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="profit" name="Lợi Nhuận Gộp" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chi Tiết Giao Dịch Gần Đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-md">Mã Giao Dịch</th>
                                        <th className="px-4 py-3">Ngày</th>
                                        <th className="px-4 py-3">Khách Hàng</th>
                                        <th className="px-4 py-3 text-right">Doanh Thu</th>
                                        <th className="px-4 py-3 text-right">Giá Vốn</th>
                                        <th className="px-4 py-3 text-right rounded-tr-md">Lợi Nhuận</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx, idx) => (
                                        <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium text-primary">{tx.id}</td>
                                            <td className="px-4 py-3">{tx.date}</td>
                                            <td className="px-4 py-3">{tx.customer}</td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {new Intl.NumberFormat('vi-VN').format(tx.amount)}₫
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {new Intl.NumberFormat('vi-VN').format(tx.cost)}₫
                                            </td>
                                            <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                                                {new Intl.NumberFormat('vi-VN').format(tx.profit)}₫
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default RevenueReportPage
