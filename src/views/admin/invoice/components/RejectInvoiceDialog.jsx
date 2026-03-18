import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { updateInvoiceStatus } from '@/stores/InvoiceSlice'
import { IconCircleX } from '@tabler/icons-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const RejectInvoiceDialog = ({ invoice, showTrigger = true, open, onOpenChange, onSuccess }) => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.invoice.loading)
  const [reason, setReason] = useState('Hủy theo yêu cầu của khách hàng')

  const handleReject = async (id) => {
    if (!reason || reason.trim().length < 10) {
      toast.error('Lý do hủy đơn phải có ít nhất 10 ký tự')
      return
    }

    try {
      await dispatch(
        updateInvoiceStatus({
          id: id,
          status: 'cancelled',
          reason: reason.trim()
        }),
      ).unwrap()
      toast.success('Hủy hóa đơn thành công')
      onOpenChange?.(false)
      onSuccess?.()
      setReason('') // Reset reason
    } catch (error) {
      console.log('Reject error: ', error)
      toast.error('Hủy hóa đơn thất bại')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <IconCircleX className="mr-2 size-4" aria-hidden="true" />
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hủy đơn bán</DialogTitle>
          <DialogDescription>
            Hành động này sẽ chuyển trạng thái đơn bán <strong>{invoice?.code}</strong> sang{' '}
            <span className="font-bold text-red-600">Đã hủy</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do hủy đơn <span className="text-red-500">*</span></Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do hủy đơn (tối thiểu 10 ký tự)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Đóng
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleReject(invoice.id)}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đồng ý hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RejectInvoiceDialog
