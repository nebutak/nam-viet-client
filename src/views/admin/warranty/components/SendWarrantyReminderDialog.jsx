import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/custom/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import api from '@/utils/axios'
import { dateFormat } from '@/utils/date-format'

export function SendWarrantyReminderDialog({ warranty, open, onOpenChange }) {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useMemo(() => {
    if (!warranty || !open) return

    const endDate = dateFormat(warranty.endDate)
    const customerName = warranty.customer?.name || ''
    const productName = warranty.product?.name || ''
    const productCode = warranty.product?.code
      ? ` (${warranty.product.code})`
      : ''
    const invoiceCode = warranty.invoice?.code || ''

    const defaultSubject = `Nhắc hạn bảo hành - ${productName}${productCode}`
    const defaultContent = [
      `Xin chào ${customerName},`,
      '',
      `Đây là email nhắc nhở về thời hạn bảo hành cho sản phẩm ${productName}${productCode}.`,
      '',
      `- Hóa đơn: ${invoiceCode}`,
      `- Số lượng: ${warranty.quantity}`,
      `- Ngày hết hạn bảo hành: ${endDate}`,
      '',
      'Nếu anh/chị cần gia hạn thêm thời gian bảo hành hoặc hỗ trợ kỹ thuật, vui lòng liên hệ lại với chúng tôi.',
      '',
      import.meta.env.VITE_COMPANY_NAME || 'Trân trọng,',
    ].join('\n')

    setSubject(defaultSubject)
    setContent(defaultContent)
  }, [warranty, open])

  const handleSend = async () => {
    if (!warranty) return
    if (!warranty.customer?.email) {
      toast.error('Khách hàng chưa có email, không thể gửi nhắc hạn')
      return
    }

    try {
      setLoading(true)
      await api.post(`/warranty/${warranty.id}/send-reminder-email`, {
        subject,
        content: content.replace(/\n/g, '<br />'),
      })

      toast.success('Đã gửi email nhắc hạn bảo hành')
      onOpenChange(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        'Có lỗi xảy ra khi gửi email nhắc hạn bảo hành'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Gửi email nhắc hạn bảo hành</DialogTitle>
        </DialogHeader>

        {warranty && (
          <div className="space-y-3 text-sm">
            <div className="rounded-md bg-muted p-3 text-xs">
              <div>
                <b>Khách hàng:</b> {warranty.customer?.name || '—'}
              </div>
              <div>
                <b>Email:</b> {warranty.customer?.email || 'Chưa có email'}
              </div>
              <div>
                <b>Sản phẩm:</b> {warranty.product?.name}{' '}
                {warranty.product?.code && `(${warranty.product.code})`}
              </div>
              <div>
                <b>Hóa đơn:</b> {warranty.invoice?.code || '—'}
              </div>
              <div>
                <b>Hết hạn bảo hành:</b> {dateFormat(warranty.endDate)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Tiêu đề email</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Nội dung email</label>
              <Textarea
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Xác nhận gửi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
