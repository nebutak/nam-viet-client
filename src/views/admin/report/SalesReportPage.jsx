import { Layout, LayoutBody } from '@/components/custom/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Users, TrendingUp, Package } from 'lucide-react'

const SalesReportPage = () => {
    return (
        <Layout>
            <LayoutBody className="flex flex-col" fixedHeight>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Báo cáo Bán hàng</h2>
                        <p className="text-muted-foreground">
                            Phân tích hiệu quả bán hàng và khách hàng
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">
                                <TrendingUp className="inline h-3 w-3 text-green-500" /> +0% so với tháng trước
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">
                                Trong tháng này
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Giá trị đơn TB</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0 ₫</div>
                            <p className="text-xs text-muted-foreground">
                                Trung bình mỗi đơn
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0%</div>
                            <p className="text-xs text-muted-foreground">
                                Từ khách tiềm năng
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top sản phẩm bán chạy</CardTitle>
                            <CardDescription>10 sản phẩm có doanh số cao nhất</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Danh sách sẽ được hiển thị tại đây
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Doanh số theo kênh</CardTitle>
                            <CardDescription>Phân bổ doanh số theo kênh bán hàng</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Biểu đồ sẽ được hiển thị tại đây
                        </CardContent>
                    </Card>
                </div>
            </LayoutBody>
        </Layout>
    )
}

export default SalesReportPage
