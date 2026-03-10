import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/custom/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import api from '@/utils/axios'
import { statuses as warrantyStatuses } from '../data'
import { statuses as invoiceStatuses } from '@/views/admin/invoice/data'
import { useDispatch } from 'react-redux'
import { getWarranties } from '@/stores/WarrantySlice'

const InfoRow = ({ label, value }) => {
  return (
    <div className="grid grid-cols-12 items-start gap-3">
      <div className="col-span-4 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      <div className="col-span-8 text-sm">{value}</div>
    </div>
  )
}

const SkeletonLine = ({ w = 'w-full' }) => {
  return <div className={`h-4 ${w} animate-pulse rounded bg-muted`} />
}

const toDateInputValue = (v) => {
  if (!v) return ''
  const d = v instanceof Date ? v : new Date(v)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = String(d.getFullYear())
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const addMonths = (date, months) => {
  if (!date || !months) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  const m = Number(months) || 0
  if (m <= 0) return null
  const out = new Date(d)
  out.setMonth(out.getMonth() + m)
  return out
}

const UpdateWarrantyDialog = ({ open, onOpenChange, warranty, onUpdated }) => {
  const id = warranty?.id
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [detail, setDetail] = useState(null)
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    status: '',
    serialNumber: '',
    quantity: 1,
    periodMonths: 0,
    startDate: '',
    note: '',
  })

  useEffect(() => {
    if (!open || !id) return

    const fetchDetail = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/warranty/${id}`)
        const data = res?.data?.data || res?.data || null

        if (!data) {
          toast.error('Không lấy được chi tiết phiếu bảo hành.')
          return
        }

        setDetail(data)
        setForm({
          status: data.status || 'pending',
          serialNumber: data.serialNumber || '',
          quantity: Number(data.quantity) || 1,
          periodMonths: Number(data.periodMonths) || 0,
          startDate: toDateInputValue(data.startDate),
          note: data.note || '',
        })
      } catch (e) {
        toast.error('Có lỗi khi tải chi tiết bảo hành.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [open, id])

  const warrantyStatusObj = useMemo(() => {
    const s = warrantyStatuses.find(
      (x) => x.value === (detail?.status || warranty?.status),
    )
    return (
      s || {
        value: detail?.status || warranty?.status,
        label: detail?.status || warranty?.status || '—',
        color: 'bg-gray-400',
      }
    )
  }, [detail?.status, warranty?.status])

  const selectedWarrantyStatusObj = useMemo(() => {
    const s = warrantyStatuses.find((x) => x.value === form.status)
    return (
      s || {
        value: form.status,
        label: form.status || '—',
        color: 'bg-gray-400',
      }
    )
  }, [form.status])

  const invoiceStatusValue =
    detail?.invoice?.status || warranty?.invoice?.status || ''
  const invoiceStatusObj = useMemo(() => {
    const v = String(invoiceStatusValue || '').toLowerCase()
    return (
      invoiceStatuses.find((s) => s.value === v) || {
        value: invoiceStatusValue,
        label: invoiceStatusValue || '—',
        icon: null,
        color: 'text-muted-foreground',
        textColor: 'text-muted-foreground',
      }
    )
  }, [invoiceStatusValue])

  const isInvoiceDelivered = !invoiceStatusValue
    ? true
    : String(invoiceStatusValue).toLowerCase() === 'delivered'

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const predictedEndDate = useMemo(() => {
    if (!form.startDate) return null
    const end = addMonths(form.startDate, form.periodMonths)
    return end
  }, [form.startDate, form.periodMonths])

  const handleSave = async () => {
    if (!id) return

    if (!form.status) {
      toast.warning('Bạn chưa chọn trạng thái!')
      return
    }

    if (!isInvoiceDelivered) {
      toast.warning(
        'Chỉ được cập nhật bảo hành khi hóa đơn ở trạng thái đi đơn.',
      )
      return
    }

    if (form.startDate) {
      const d = new Date(form.startDate)
      if (Number.isNaN(d.getTime())) {
        toast.warning('Ngày bắt đầu bảo hành không hợp lệ!')
        return
      }
    }

    try {
      setSaving(true)

      const payload = {
        status: form.status,
        serialNumber: form.serialNumber || null,
        quantity: Number(form.quantity) || 0,
        warrantyCost: 0,
        periodMonths: Number(form.periodMonths) || 0,
        note: form.note || null,
        startDate: form.startDate ? form.startDate : null,
      }

      await api.put(`/warranty/${id}/update`, payload)

      toast.success('Cập nhật phiếu bảo hành thành công.')
      onOpenChange(false)
      onUpdated?.()
    } catch (e) {
      toast.error(
        e?.response?.data?.message || 'Cập nhật phiếu bảo hành thất bại.',
      )
    } finally {
      await dispatch(getWarranties()).unwrap()
      setSaving(false)
    }
  }

  const customerName = detail?.customer?.name || warranty?.customer?.name || '—'
  const customerPhone =
    detail?.customer?.phone || warranty?.customer?.phone || ''
  const customerEmail =
    detail?.customer?.email || warranty?.customer?.email || ''
  const productName = detail?.product?.name || warranty?.product?.name || '—'
  const productCode = detail?.product?.code || warranty?.product?.code || ''
  const invoiceCode = detail?.invoice?.code || warranty?.invoice?.code || '—'

  const InvoiceIcon = invoiceStatusObj.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col p-0 sm:max-w-[720px]">
        <DialogHeader className="px-6 pt-6">
          <div className="mt-3 flex items-start justify-between gap-2">
            <div className="space-y-1">
              <DialogTitle>Cập nhật bảo hành</DialogTitle>
              <DialogDescription>
                Xem thông tin và cập nhật trạng thái/thuộc tính bảo hành.
              </DialogDescription>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="outline"
                className={`${warrantyStatusObj.color} border-0 text-white`}
              >
                {warrantyStatusObj.label}
              </Badge>

              <div className="flex items-center gap-2 text-xs">
                {InvoiceIcon ? (
                  <InvoiceIcon
                    className={`h-4 w-4 ${invoiceStatusObj.textColor}`}
                  />
                ) : null}
                <span className={`font-medium ${invoiceStatusObj.textColor}`}>
                  {invoiceStatusObj.label}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6">
          <div className="rounded-xl border bg-background p-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Thông tin</div>
              {detail?.code && (
                <Badge variant="outline" className="text-xs">
                  #{detail.code}
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                <SkeletonLine w="w-3/4" />
                <SkeletonLine w="w-2/3" />
                <SkeletonLine w="w-1/2" />
                <SkeletonLine w="w-3/5" />
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow
                  label="Khách hàng"
                  value={
                    <div className="flex flex-col">
                      <span className="font-medium">{customerName}</span>
                      <div className="text-xs text-muted-foreground">
                        {customerPhone ? `SĐT: ${customerPhone}` : 'SĐT: —'}
                        {customerEmail ? ` • Email: ${customerEmail}` : ''}
                      </div>
                    </div>
                  }
                />
                <InfoRow
                  label="Sản phẩm"
                  value={
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {productName}
                        {productCode ? (
                          <span className="text-muted-foreground">
                            {' '}
                            ({productCode})
                          </span>
                        ) : null}
                      </span>
                    </div>
                  }
                />
                <InfoRow
                  label="Hóa đơn"
                  value={
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invoiceCode}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        {InvoiceIcon ? (
                          <InvoiceIcon
                            className={`h-4 w-4 ${invoiceStatusObj.textColor}`}
                          />
                        ) : null}
                        <span
                          className={`text-xs font-medium ${invoiceStatusObj.textColor}`}
                        >
                          {invoiceStatusObj.label}
                        </span>
                      </div>
                    </div>
                  }
                />
              </div>
            )}

            {!loading && !isInvoiceDelivered && (
              <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-700">
                Bạn chỉ có thể cập nhật bảo hành khi hóa đơn ở trạng thái{' '}
                <b>Đi đơn</b>.
              </div>
            )}
          </div>

          <Separator />

          <div className="rounded-xl border bg-background p-2">
            <div className="mb-2 text-sm font-semibold">Cập nhật</div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Trạng thái <span className="text-red-500">*</span>
                </div>

                <Select
                  value={form.status || undefined}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, status: value }))
                  }
                >
                  <SelectTrigger className="h-10">
                    {form.status ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${selectedWarrantyStatusObj.color}`}
                        />
                        <span>{selectedWarrantyStatusObj.label}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Chọn trạng thái" />
                    )}
                  </SelectTrigger>

                  <SelectContent>
                    {warrantyStatuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${s.color}`}
                          />
                          <span>{s.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Serial</div>
                <Input
                  className="h-10"
                  value={form.serialNumber}
                  onChange={handleChange('serialNumber')}
                  placeholder="Nhập số serial..."
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Số lượng</div>
                <Input
                  className="h-10"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange('quantity')}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Thời hạn (tháng)</div>
                <Input
                  className="h-10"
                  type="number"
                  value={form.periodMonths}
                  onChange={handleChange('periodMonths')}
                  min={0}
                />
              </div>

              {/* NEW: Start date */}
              <div className="space-y-2 sm:col-span-1">
                <div className="text-sm font-medium">Ngày bắt đầu bảo hành</div>
                <Input
                  className="h-10"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange('startDate')}
                />
              </div>

              {/* Preview end date */}
              <div className="space-y-2 sm:col-span-1">
                <div className="text-sm font-medium">Ngày hết hạn dự kiến</div>
                <Input
                  className="h-10"
                  value={
                    predictedEndDate ? toDateInputValue(predictedEndDate) : ''
                  }
                  placeholder="—"
                  readOnly
                />
                <div className="text-xs text-muted-foreground">
                  Tự tính theo “Ngày bắt đầu” + “Thời hạn (tháng)”.
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <div className="text-sm font-medium">Ghi chú</div>
                <Textarea
                  value={form.note}
                  onChange={handleChange('note')}
                  placeholder="Nhập ghi chú..."
                  className="min-h-[110px]"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 px-6 pb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || loading || !isInvoiceDelivered}
          >
            {saving ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateWarrantyDialog
