import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../../../../../components/ui/dialog'
import { Button } from '../../../../../components/ui/button'
import { ExternalLink, Package, Tag, Archive, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { moneyFormat } from '../../../../../utils/money-format'

export const DashboardProductDetailDialog = ({ open, product, onClose }) => {
    const navigate = useNavigate()

    if (!product) return null

    const handleNavigate = () => {
        onClose()
        // determine if it's from low stock or top product to route correctly
        const id = product.product_id || product.id
        navigate(`/product`)
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <DialogTitle>Chi tiết Sản phẩm</DialogTitle>
                    </div>
                    <DialogDescription>
                        Trích xuất thông tin nhanh của sản phẩm này.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-md border">
                        <div className="col-span-2 space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                <span>Tên sản phẩm</span>
                            </div>
                            <p className="font-medium text-foreground text-base">{product.name || product.product_name}</p>
                            <span className="text-xs text-muted-foreground">SKU: {product.sku || '-'}</span>
                        </div>

                        {/* Display specific fields if from TopProducts (has sold, revenue) */}
                        {(product.sold !== undefined || product.revenue !== undefined) && (
                            <>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BarChart3 className="h-4 w-4" />
                                        <span>Đã bán</span>
                                    </div>
                                    <p className="font-medium text-foreground">{product.sold || product.total_quantity || 0}</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Tag className="h-4 w-4" />
                                        <span>Doanh thu</span>
                                    </div>
                                    <p className="font-bold text-primary">{moneyFormat(product.revenue || product.total_revenue || 0)}</p>
                                </div>
                            </>
                        )}

                        {/* Display specific fields if from LowStock (has warehouse, stock) */}
                        {(product.available_quantity !== undefined || product.min_stock_level !== undefined) && (
                            <>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Archive className="h-4 w-4" />
                                        <span>Tồn kho hiện tại</span>
                                    </div>
                                    <p className="font-bold text-orange-600">{product.available_quantity || product.stock || 0}</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Archive className="h-4 w-4" />
                                        <span>Mức tối thiểu</span>
                                    </div>
                                    <p className="font-medium text-muted-foreground">{product.min_stock_level || 0}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                        <Button onClick={handleNavigate} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Xem quản lý sản phẩm
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
