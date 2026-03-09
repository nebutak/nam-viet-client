import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { Download, AlertTriangle, Archive, RefreshCw, BarChart2 } from 'lucide-react'

const inventoryData = [
    { id: 'SP-001', name: 'Bột Thạch Cốt Dừa', category: 'Nguyên liệu', currentStock: 450, minStock: 500, status: 'Cảnh báo', turnover: 12.5 },
    { id: 'SP-002', name: 'Siro Dâu Tây 1L', category: 'Thành phẩm', currentStock: 120, minStock: 100, status: 'Bình thường', turnover: 8.2 },
    { id: 'SP-003', name: 'Sữa Đặc Ngôi Sao', category: 'Thiết yếu', currentStock: 30, minStock: 200, status: 'Hết hàng', turnover: 24.1 },
    { id: 'SP-004', name: 'Trà Đen Phúc Long', category: 'Nguyên liệu', currentStock: 800, minStock: 300, status: 'Tốt', turnover: 5.4 },
]

const InventoryReportPage = () => {
    return (
        <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Báo Cáo Tồn Kho & Vòng Quay</h1>
                    <p className="text-muted-foreground mt-1">Quản lý hiệu quả lưu trữ và cảnh báo thiếu hụt vật tư</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Xuất Excel</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Giá Trị Tồn Kho</CardTitle>
                        <Archive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,450,000,000 ₫</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hệ Số Vòng Quay (TB)</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">12.5 vòng/năm</div>
                        <p className="text-xs text-muted-foreground mt-1">Tương đương ~29 ngày lưu kho</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sản Phẩm Cảnh Báo</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">24 SP</div>
                        <p className="text-xs text-muted-foreground mt-1">Dưới mức tồn tối thiểu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tỷ Lệ Lấp Đầy</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">68%</div>
                        <p className="text-xs text-muted-foreground mt-1">An toàn (Mức chuẩn: 60-80%)</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chi Tiết Vòng Quay Tồn Kho</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-md">Mã SP</th>
                                    <th className="px-4 py-3">Tên Sản Phẩm</th>
                                    <th className="px-4 py-3">Danh Mục</th>
                                    <th className="px-4 py-3 text-right">Tồn Hiện Tại</th>
                                    <th className="px-4 py-3 text-center">Tình Trạng</th>
                                    <th className="px-4 py-3 text-right rounded-tr-md">Vòng Quay / Năm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryData.map((item, idx) => (
                                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium text-primary">{item.id}</td>
                                        <td className="px-4 py-3 font-semibold">{item.name}</td>
                                        <td className="px-4 py-3">{item.category}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`font-medium ${item.currentStock < item.minStock ? 'text-destructive' : ''}`}>
                                                {item.currentStock}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-1">/ {item.minStock}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-medium 
                        ${item.status === 'Tốt' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'Hết hàng' ? 'bg-red-100 text-red-700' :
                                                        item.status === 'Cảnh báo' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-100 text-blue-700'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">{item.turnover}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default InventoryReportPage
