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
import { TrashIcon } from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { deleteWarranty } from '@/stores/WarrantySlice'

const DeleteWarrantyDialog = ({
  warranty,
  showTrigger = true,
  onDeleted,
  ...props
}) => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.warranty?.loading)

  const destroy = async () => {
    if (!warranty?.id) return

    try {
      await dispatch(deleteWarranty(warranty.id)).unwrap()
      onDeleted?.(warranty)
    } catch (error) {
      console.log('Delete warranty error: ', error)
    }
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn xóa bảo hành này?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác.
            <br />
            Phiếu bảo hành của hóa đơn:{' '}
            <strong>{warranty?.invoice?.code}</strong>
            <br />
            Sản phẩm: <strong>{warranty?.product?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" onClick={destroy} loading={loading}>
              Tiếp tục
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteWarrantyDialog }
