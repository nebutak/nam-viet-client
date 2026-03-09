import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { Download, Printer, Factory, PlaySquare, FileCheck2, AlertCircle } from 'lucide-react'
import html2pdf from 'html2pdf.js'
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
    ResponsiveContainer
} from 'recharts'

const productionStatusData = [
    { name: 'Hoàn thành', value: 45 },
    { name: 'Đang chạy', value: 30 },
    { name: 'Tạm dừng', value: 15 },
    { name: 'Hủy/Lỗi', value: 10 },
]

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

const efficiencyData = [
    { line: 'Dây chuyền 1', expected: 1000, actual: 950 },
    { line: 'Dây chuyền 2', expected: 800, actual: 820 },
    { line: 'Dây chuyền 3', expected: 1200, actual: 1100 },
    { line: 'Phòng Pha chế', expected: 500, actual: 480 },
]

const recentProductionOrders = [
    { id: 'LSX-101', date: '07/03/2026', product: 'Trà Sữa Khoai Môn', quantity: 500, status: 'Hoàn thành' },
    { id: 'LSX-102', date: '07/03/2026', product: 'Lục Trà Lài', quantity: 1200, status: 'Đang chạy' },
    { id: 'LSX-103', date: '06/03/2026', product: 'Thạch Trân Châu', quantity: 300, status: 'Tạm dừng' },
    { id: 'LSX-104', date: '05/03/2026', product: 'Hồng Trà Sữa', quantity: 800, status: 'Hoàn thành' },
]

const ProductionReportPage = () => {
    const [dateRange, setDateRange] = useState('Tuần này')
    const reportRef = useRef(null)

    const handleExportPDF = () => {
        const element = reportRef.current
        const opt = {
            margin: 1,
            filename: 'Bao_Cao_San_Xuat.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        }
        html2pdf().set(opt).from(element).save()
    }

    return (
        <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Báo Cáo Sản Xuất</h1>
                    <p className="text-muted-foreground mt-1">Phân tích hiệu suất dây chuyền và trạng thái lệnh sản xuất</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary mr-2"
                    >
                        <option>Hôm nay</option>
                        <option>Tuần này</option>
                        <option>Tháng này</option>
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
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng Lệnh Sản Xuất</CardTitle>
                            <Factory className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">124</div>
                            <p className="text-xs text-muted-foreground mt-1">+5 so với tuần trước</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Đang Chế Biến</CardTitle>
                            <PlaySquare className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">18</div>
                            <p className="text-xs text-muted-foreground mt-1">Lệnh đang chạy</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tỷ Lệ Hoàn Thành</CardTitle>
                            <FileCheck2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">85.4%</div>
                            <p className="text-xs text-muted-foreground mt-1">Vượt mục tiêu (80%)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lỗi / Hủy</CardTitle>
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-500">3</div>
                            <p className="text-xs text-muted-foreground mt-1">-2 so với tuần trước</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Trạng Thái Lệnh Sản Xuất</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={productionStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {productionStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Hiệu Suất Dây Chuyền (Dự kiến vs Thực tế)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={efficiencyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="line" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="expected" name="Dự kiện (Đơn vị)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="actual" name="Thực tế (Đơn vị)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lệnh Gần Đây */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lệnh Sản Xuất Mới Nhất</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-md">Mã Lệnh</th>
                                        <th className="px-4 py-3">Ngày Tạp</th>
                                        <th className="px-4 py-3">Sản Phẩm</th>
                                        <th className="px-4 py-3 text-right">Số Lượng</th>
                                        <th className="px-4 py-3 text-center rounded-tr-md">Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProductionOrders.map((order, idx) => (
                                        <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium text-primary">{order.id}</td>
                                            <td className="px-4 py-3">{order.date}</td>
                                            <td className="px-4 py-3 font-semibold">{order.product}</td>
                                            <td className="px-4 py-3 text-right">{new Intl.NumberFormat('vi-VN').format(order.quantity)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-medium 
                          ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Đang chạy' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'Hủy/Lỗi' ? 'bg-red-100 text-red-700' :
                                                                'bg-orange-100 text-orange-700'}`}>
                                                    {order.status}
                                                </span>
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

export default ProductionReportPage
