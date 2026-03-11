import { Layout, LayoutBody } from '@/components/custom/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react'

const FinancialReportPage = () => {
    return (
        <Layout>
            <LayoutBody className="flex flex-col" fixedHeight>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Báo cáo Tài chính</h2>
                        <p className="text-muted-foreground">
                            Tổng quan tình hình tài chính doanh nghiệp
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng thu</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">0 ₫</div>
                            <p className="text-xs text-muted-foreground">
                                Trong tháng này
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng chi</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">0 ₫</div>
                            <p className="text-xs text-muted-foreground">
                                Trong tháng này
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lợi nhuận</CardTitle>
                            <Wallet className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">0 ₫</div>
                            <p className="text-xs text-muted-foreground">
                                Thu - Chi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tỷ suất LN</CardTitle>
                            <PieChart className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">0%</div>
                            <p className="text-xs text-muted-foreground">
                                Lợi nhuận / Doanh thu
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dòng tiền</CardTitle>
                            <CardDescription>Thu chi theo tháng trong năm</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Biểu đồ sẽ được hiển thị tại đây
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cơ cấu chi phí</CardTitle>
                            <CardDescription>Phân bổ chi phí theo loại</CardDescription>
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

export default FinancialReportPage
