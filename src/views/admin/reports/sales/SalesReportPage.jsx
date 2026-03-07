import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { Download, Users, TrendingUp, ShoppingBag, MapPin, Printer } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts'

const performanceData = [
    { name: 'Nguyễn Văn A', revenue: 150000000, orders: 45, avgOrderValue: 3333333 },
    { name: 'Trần Thị B', revenue: 120000000, orders: 38, avgOrderValue: 3157894 },
    { name: 'Lê Hoàng C', revenue: 95000000, orders: 25, avgOrderValue: 3800000 },
    { name: 'Phạm Văn D', revenue: 80000000, orders: 30, avgOrderValue: 2666666 },
]

const customerData = [
    { region: 'Miền Bắc', newCustomers: 120, returningCustomers: 350 },
    { region: 'Miền Trung', newCustomers: 85, returningCustomers: 150 },
    { region: 'Miền Nam', newCustomers: 210, returningCustomers: 480 },
]

const SalesReportPage = () => {
    const [dateRange, setDateRange] = useState('Tháng này')
    const reportRef = useRef(null)

    const handleExportPDF = () => {
        const element = reportRef.current
        const opt = {
            margin: 1,
            filename: 'Bao_Cao_Ban_Hang.pdf',
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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Báo Cáo Bán Hàng</h1>
                    <p className="text-muted-foreground mt-1">Phân tích hiệu suất nhân viên và tăng trưởng khách hàng</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Khách Hàng Mới</CardTitle>
                            <Users className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">415</div>
                            <p className="text-xs text-muted-foreground mt-1">+12% so với tháng trước</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Khách Quay Lại</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">980</div>
                            <p className="text-xs text-muted-foreground mt-1">Tỷ lệ giữ chân: 68%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nhân Viên Xuất Sắc</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold truncate">Nguyễn Văn A</div>
                            <p className="text-xs text-muted-foreground mt-1">Doanh số: 150M</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vùng Bản Hàng Tốt Nhất</CardTitle>
                            <MapPin className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">Miền Nam</div>
                            <p className="text-xs text-muted-foreground mt-1">Chiếm 45% tổng KH</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hiệu Suất Nhân Viên Bán Hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performanceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" tickFormatter={(val) => `${val / 1000000}M`} />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                        <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ' ₫'} />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Doanh Số" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Phân Bổ Khách Hàng Theo Khu Vực</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={customerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="region" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="returningCustomers" stackId="a" name="Khách cũ" fill="#10b981" barSize={30} />
                                        <Bar dataKey="newCustomers" stackId="a" name="Khách mới" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Bảng Xếp Hạng Nhân Viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-md">Hạng</th>
                                        <th className="px-4 py-3">Nhân Viên</th>
                                        <th className="px-4 py-3 text-right">Số Đơn Hàng</th>
                                        <th className="px-4 py-3 text-right">Giá Trị TB / Đơn</th>
                                        <th className="px-4 py-3 text-right rounded-tr-md">Tổng Doanh Số</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceData.sort((a, b) => b.revenue - a.revenue).map((emp, idx) => (
                                        <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">#{idx + 1}</td>
                                            <td className="px-4 py-3 font-semibold text-primary">{emp.name}</td>
                                            <td className="px-4 py-3 text-right">{emp.orders}</td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {new Intl.NumberFormat('vi-VN').format(emp.avgOrderValue)} ₫
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                                {new Intl.NumberFormat('vi-VN').format(emp.revenue)} ₫
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

export default SalesReportPage
