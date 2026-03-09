import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../../../../../components/ui/dialog'
import { Button } from '../../../../../components/ui/button'
import { ExternalLink, Receipt, User, Calendar, CreditCard, Box } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { moneyFormat } from '../../../../../utils/money-format'

export const DashboardOrderDetailDialog = ({ open, order, onClose }) => {
    const navigate = useNavigate()

    if (!order) return null

    const handleNavigate = () => {
        onClose()
        navigate(`/invoice`)
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        <DialogTitle>Chi tiết Đơn hàng: {order.order_code || order.id}</DialogTitle>
                    </div>
                    <DialogDescription>
                        Trích xuất thông tin nhanh từ mã đơn hàng này trên Dashboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-md border">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>Khách hàng</span>
                            </div>
                            <p className="font-medium text-foreground">{order.customer?.name || order.customer_name || 'Khách lẻ'}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Ngày đặt</span>
                            </div>
                            <p className="font-medium text-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : (order.date || '-')}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                <span>Tổng tiền</span>
                            </div>
                            <p className="font-bold text-primary">{moneyFormat(order.final_amount || order.total || 0)}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Box className="h-4 w-4" />
                                <span>Trạng thái</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit
                                ${order.status === 'completed' || order.status === 'Đã giao' ? 'bg-green-100 text-green-700' :
                                    order.status === 'processing' || order.status === 'Đang xử lý' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'pending' || order.status === 'Chờ duyệt' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                        <Button onClick={handleNavigate} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Xử lý đơn hàng này
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
