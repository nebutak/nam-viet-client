import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/custom/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { DeleteReceiptDialog } from './DeleteReceiptDialog'
import { useDispatch, useSelector } from 'react-redux'
import { getReceiptQRCode, updateReceiptStatus } from '@/stores/ReceiptSlice'
import { toast } from 'sonner'
import {
  Eye,
  Printer,
  Trash2,
  QrCode,
  Ban,
} from 'lucide-react'
import PaymentQRCodeDialog from './PaymentQRCodeDialog'
import ViewReceiptDialog from './ViewReceiptDialog'
import PrintReceiptView from './PrintReceiptView'

const DataTableRowActions = ({ row }) => {
  const [showDeleteReceiptDialog, setShowDeleteReceiptDialog] = useState(false)
  const [showViewReceiptDialog, setShowViewReceiptDialog] = useState(false)
  const [printData, setPrintData] = useState(null)

  const [openQrDialog, setOpenQrDialog] = useState(false)
  const [qrCodeData, setQrCodeData] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)

  const dispatch = useDispatch()
  const setting = useSelector((state) => state.setting.setting)
  const receipt = row.original

  const handleCancel = async () => {
    if (confirm('Bạn có chắc chắn muốn hủy phiếu thu này không?')) {
      try {
        await dispatch(updateReceiptStatus({ id: receipt.id, status: 'cancelled' })).unwrap()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleGenerateQR = async () => {
    if (receipt.status !== 'draft') {
      toast.warning('Chỉ có thể tạo mã QR cho phiếu thu nháp')
      return
    }

    try {
      setQrLoading(true)
      const qrData = await dispatch(getReceiptQRCode(receipt.id)).unwrap()
      setQrCodeData(qrData)
      setOpenQrDialog(true)
    } catch (error) {
      console.error('Failed to fetch QR code:', error)
      toast.error('Không lấy được mã QR thanh toán')
    } finally {
      setQrLoading(false)
    }
  }

  const handlePrintReceipt = () => {
    setPrintData(receipt)
  }

  return (
    <>
      <PaymentQRCodeDialog
        open={openQrDialog}
        onOpenChange={setOpenQrDialog}
        qrCodeData={qrCodeData}
      />

      {showViewReceiptDialog && (
        <ViewReceiptDialog
          open={showViewReceiptDialog}
          onOpenChange={setShowViewReceiptDialog}
          receiptId={receipt.id}
          showTrigger={false}
        />
      )}

      {showDeleteReceiptDialog && (
        <DeleteReceiptDialog
          open={showDeleteReceiptDialog}
          onOpenChange={setShowDeleteReceiptDialog}
          receipt={receipt}
          showTrigger={false}
        />
      )}

      {/* Print View */}
      {printData && (
        <PrintReceiptView
          receipt={printData}
          setting={setting}
          onAfterPrint={() => setPrintData(null)}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => setShowViewReceiptDialog(true)}
            className="text-blue-600 focus:text-blue-600"
          >
            <Eye className="mr-2 h-4 w-4" />
            Xem chi tiết
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handlePrintReceipt}
            className="text-violet-600 focus:text-violet-600"
          >
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
          </DropdownMenuItem>

          {receipt.status === 'posted' && (
            <DropdownMenuItem
              onSelect={handleCancel}
              className="text-destructive focus:text-destructive"
            >
              <Ban className="mr-2 h-4 w-4" />
              Hủy
            </DropdownMenuItem>
          )}

          {receipt.status === 'draft' && (
            <>
              <DropdownMenuItem
                onSelect={handleGenerateQR}
                className="text-purple-600 focus:text-purple-600"
              >
                <QrCode className="mr-2 h-4 w-4" />
                Tạo QR
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setShowDeleteReceiptDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </>
          )}

          {(receipt.status === 'cancelled' ||
            receipt.status === 'canceled') && (
              <DropdownMenuItem
                onSelect={() => setShowDeleteReceiptDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { DataTableRowActions }
