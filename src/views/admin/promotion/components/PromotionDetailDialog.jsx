import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { dateFormat } from '@/utils/date-format'
import { applicableToOptions, promotionStatuses, promotionTypes } from '../data'
import { useEffect, useState } from 'react'
import api from '@/utils/axios'

export function PromotionDetailDialog({ open, onOpenChange, promotion }) {
    const [products, setProducts] = useState([])

    useEffect(() => {
        if (!open) return
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products?limit=1000')
                if (res.data?.data) {
                    setProducts(res.data.data)
                } else if (res.data) {
                    setProducts(res.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchProducts()
    }, [open])

    const getProductName = (id) => {
        if (!id) return ''
        const product = products.find(p => p.id === Number(id))
        return product ? product.productName : `ID: ${id}`
    }

    if (!promotion) return null

    const type = promotionTypes.find((t) => t.value === promotion.promotionType)
    const status = promotionStatuses.find((s) => s.value === promotion.status)
    const applicableTo = applicableToOptions.find((a) => a.value === promotion.applicableTo)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Chi tiết khuyến mãi</span>
                        <Badge variant={status?.variant || 'outline'}>{status?.label || promotion.status}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Mã KM: <strong className="text-foreground">{promotion.promotionCode}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 md:grid-cols-2 text-sm">
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Tên chương trình:</span>
                        <p className="font-medium">{promotion.promotionName}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Loại khuyến mãi:</span>
                        <p className="font-medium">{type?.label || promotion.promotionType}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Thời gian bắt đầu:</span>
                        <p className="font-medium">{promotion.startDate ? dateFormat(promotion.startDate) : '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Thời gian kết thúc:</span>
                        <p className="font-medium">{promotion.endDate ? dateFormat(promotion.endDate) : '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Phạm vi áp dụng:</span>
                        <p className="font-medium">{applicableTo?.label || promotion.applicableTo}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Tổng lượt dùng:</span>
                        <p className="font-medium">
                            {promotion.usageCount} / {promotion.quantityLimit || 'Không giới hạn'}
                        </p>
                    </div>
                    {promotion.applicableTo === 'specific_product' && promotion.products?.[0]?.productId && (
                        <div className="space-y-1">
                            <span className="text-muted-foreground">Sản phẩm áp dụng:</span>
                            <p className="font-medium">
                                {getProductName(promotion.products[0].productId)}
                                {promotion.conditions?.buy_quantity ? ` (Số lượng: ${promotion.conditions.buy_quantity})` : ''}
                            </p>
                        </div>
                    )}
                    {(promotion.promotionType === 'buy_x_get_y' || promotion.applicableTo === 'specific_product') &&
                        (promotion.products?.[0]?.giftProductId || promotion.conditions?.gift_product_id) && (
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Sản phẩm tặng (Gift):</span>
                                <p className="font-medium">
                                    {getProductName(promotion.products?.[0]?.giftProductId || promotion.conditions?.gift_product_id)}
                                    {(promotion.conditions?.get_quantity || promotion.products?.[0]?.giftQuantity)
                                        ? ` (Số lượng: ${promotion.conditions?.get_quantity || promotion.products?.[0]?.giftQuantity})`
                                        : ''}
                                </p>
                            </div>
                        )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
