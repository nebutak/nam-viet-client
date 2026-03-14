import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react'
import { postTransaction, getStockTransactions, getStockTransactionById } from '@/stores/StockTransactionSlice'
import { ExportDetailDialog } from './ExportDetailDialog'

export function ExportRowActions({ row }) {
    const transaction = row.original
    const dispatch = useDispatch()
    const { actionLoading } = useSelector((s) => s.stockTransaction)

    const [showDetail, setShowDetail] = useState(false)
    const [detailData, setDetailData] = useState(null)
    const isPosted = transaction.isPosted

    const refresh = () =>
        dispatch(getStockTransactions({ transactionType: 'export', limit: 20, page: 1 }))

    const handleViewDetail = async () => {
        const result = await dispatch(getStockTransactionById(transaction.id)).unwrap()
        setDetailData(result)
        setShowDetail(true)
    }

    const handlePost = async () => {
        await dispatch(postTransaction({ id: transaction.id, notes: '' })).unwrap()
        refresh()
        setShowApprove(false)
    }

    return (
        <>
            <ExportDetailDialog transaction={detailData} open={showDetail} onOpenChange={setShowDetail} />

            <AlertDialog open={showApprove} onOpenChange={setShowApprove}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ghi sổ phiếu xuất kho?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Phiếu <b>{transaction.transactionCode || `#${transaction.id}`}</b> sẽ được ghi sổ và tồn kho sẽ được cập nhật.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePost} disabled={actionLoading}>
                            {actionLoading ? 'Đang ghi sổ...' : 'Ghi sổ'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[170px]">
                    <DropdownMenuItem onClick={handleViewDetail}>
                        <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                        Xem chi tiết
                    </DropdownMenuItem>
                    {!isPosted && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowApprove(true)} className="text-green-700 focus:text-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Ghi sổ phiếu
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
