import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/custom/Button'

import { statuses } from '../data'
import { updateWarrantyStatusById } from '@/stores/WarrantySlice'

const UpdateWarrantyStatusDialog = ({ open, onOpenChange, warranty }) => {
  const dispatch = useDispatch()

  const [selectedStatus, setSelectedStatus] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelectedStatus(warranty?.status || null)
  }, [open, warranty])

  const selectedStatusObj = useMemo(() => {
    return (
      statuses.find((s) => s.value === selectedStatus) ||
      (selectedStatus
        ? { value: selectedStatus, label: selectedStatus, color: 'bg-gray-400' }
        : null)
    )
  }, [selectedStatus])

  const handleUpdateStatus = async () => {
    if (!warranty) return

    if (!selectedStatus) {
      toast.warning('Bạn chưa chọn trạng thái!')
      return
    }

    try {
      setUpdating(true)

      const resultAction = await dispatch(
        updateWarrantyStatusById({
          id: warranty.id,
          dataToSend: { status: selectedStatus },
        }),
      )

      if (updateWarrantyStatusById.fulfilled.match(resultAction)) {
        toast.success('Cập nhật trạng thái bảo hành thành công.')
        onOpenChange(false)
      } else {
        toast.error(
          resultAction.payload || 'Cập nhật trạng thái bảo hành thất bại.',
        )
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái bảo hành</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-sm">
            <div>
              <span className="font-medium">Khách hàng: </span>
              {warranty?.customer?.name || '—'}
            </div>
            <div>
              <span className="font-medium">Sản phẩm: </span>
              {warranty?.product?.name || '—'}
            </div>
            <div>
              <span className="font-medium">Trạng thái hiện tại: </span>
              {statuses.find((s) => s.value === warranty?.status)?.label ||
                warranty?.status ||
                '—'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium">
              Trạng thái <span className="text-red-500">*</span>
            </span>

            <Select
              value={selectedStatus || undefined}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                {/* Không dùng SelectValue text thuần nữa, hiển thị có màu */}
                {selectedStatusObj ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${selectedStatusObj.color}`}
                    />
                    <span>{selectedStatusObj.label}</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Chọn trạng thái" />
                )}
              </SelectTrigger>

              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                      <span>{s.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={updating}
          >
            Hủy
          </Button>
          <Button size="sm" onClick={handleUpdateStatus} disabled={updating}>
            {updating ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateWarrantyStatusDialog
