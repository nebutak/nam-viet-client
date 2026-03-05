import { Layout, LayoutBody } from '@/components/custom/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Archive, Package, AlertTriangle, TrendingUp } from 'lucide-react'

const InventoryReportPage = () => {
    return (
        <Layout>
            <LayoutBody className="flex flex-col" fixedHeight>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Báo cáo Tồn kho</h2>
                        <p className="text-muted-foreground">
                            Theo dõi tình trạng tồn kho và cảnh báo
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng giá trị tồn kho</CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0 ₫</div>
                            <p className="text-xs text-muted-foreground">
                                Tính theo giá nhập
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Số lượng sản phẩm</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">
                                Tổng số SKU trong kho
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cảnh báo tồn kho</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">0</div>
                            <p className="text-xs text-muted-foreground">
                                Sản phẩm dưới mức tối thiểu
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vòng quay kho</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">
                                Lần/tháng
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-4 flex-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tồn kho theo danh mục</CardTitle>
                            <CardDescription>Phân bổ tồn kho theo từng danh mục sản phẩm</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                            Biểu đồ sẽ được hiển thị tại đây
                        </CardContent>
                    </Card>
                </div>
            </LayoutBody>
        </Layout>
    )
}

export default InventoryReportPage
