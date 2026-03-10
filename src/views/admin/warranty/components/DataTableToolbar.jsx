import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/custom/Button'
import { Input } from '@/components/ui/input'
import { statuses } from '../data'
import { DataTableViewOptions } from './DataTableViewOption'
import { DataTableFacetedFilter } from './DataTableFacetedFilter'
import { useState } from 'react'
import Can from '@/utils/can'
import { IconFileDollar, IconMail } from '@tabler/icons-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EllipsisVertical } from 'lucide-react'
import { useMediaQuery } from '@/hooks/UseMediaQuery'
import { toast } from 'sonner'
import CreateWarrantyQuoteDialog from './CreateWarrantyQuoteDialog'
import { SendWarrantyReminderDialog } from './SendWarrantyReminderDialog'

const DataTableToolbar = ({ table }) => {
  const isFiltered = table.getState().columnFilters.length > 0

  const [showCreateWarrantyQuoteDialog, setShowCreateWarrantyQuoteDialog] =
    useState(false)
  const [showSendReminderDialog, setShowSendReminderDialog] = useState(false)
  const [selectedWarranty, setSelectedWarranty] = useState(null)

  const isMobile = useMediaQuery('(max-width: 768px)')
  const selectedRows = table.getSelectedRowModel().rows

  const getSelectedWarranty = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original)

    if (selected.length === 0) {
      toast.warning('Bạn chưa chọn phiếu bảo hành nào!')
      return null
    }

    if (selected.length > 1) {
      toast.warning('Chỉ được chọn một phiếu bảo hành!')
      return null
    }

    return selected[0]
  }

  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm khách hàng, SĐT..."
          value={table.getState().globalFilter || ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-8 flex-1 text-sm"
        />

        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="Trạng thái"
              options={statuses}
            />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Can permission={'CREATE_INVOICE'}>
              <DropdownMenuItem
                disabled={selectedRows.length !== 1}
                onClick={() => {
                  const warranty = getSelectedWarranty()
                  if (!warranty) return
                  setSelectedWarranty(warranty)
                  setShowCreateWarrantyQuoteDialog(true)
                }}
                className="text-xs text-primary"
              >
                <IconFileDollar className="mr-2 h-3 w-3" />
                Gia hạn BH
              </DropdownMenuItem>
            </Can>
            <Can permission={'REMIND_WARRANTY'}>
              <DropdownMenuItem
                disabled={selectedRows.length !== 1}
                onClick={() => {
                  const warranty = getSelectedWarranty()
                  if (!warranty) return

                  if (!warranty.customer?.email) {
                    return toast.warning('Khách hàng chưa có email, không thể gửi nhắc hạn.')
                  }

                  setSelectedWarranty(warranty)
                  setShowSendReminderDialog(true)
                }}
                className="text-xs text-primary"
              >
                <IconMail className="mr-2 h-3 w-3" />
                Nhắc hạn BH
              </DropdownMenuItem>
            </Can>
          </DropdownMenuContent>
        </DropdownMenu>

        {showCreateWarrantyQuoteDialog && selectedWarranty && (
          <CreateWarrantyQuoteDialog
            open={showCreateWarrantyQuoteDialog}
            onOpenChange={setShowCreateWarrantyQuoteDialog}
            warranty={selectedWarranty}
          />
        )}

        {showSendReminderDialog && selectedWarranty && (
          <SendWarrantyReminderDialog
            open={showSendReminderDialog}
            onOpenChange={setShowSendReminderDialog}
            warranty={selectedWarranty}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Tìm khách hàng, SĐT..."
          value={table.getColumn('customerInfo')?.getFilterValue() || ''}
          onChange={(e) =>
            table.getColumn('customerInfo')?.setFilterValue(e.target.value)
          }
          className="h-8 w-[200px] lg:w-[350px]"
        />

        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="Trạng thái"
              options={statuses}
            />
          )}
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Đặt lại
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Can permission={'CREATE_INVOICE'}>
          <Button
            onClick={() => {
              const warranty = getSelectedWarranty()
              if (!warranty) return
              setSelectedWarranty(warranty)
              setShowCreateWarrantyQuoteDialog(true)
            }}
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary/10 hover:text-primary"
          >
            <IconFileDollar className="mr-2 size-4" />
            Gia hạn BH
          </Button>
        </Can>

        <Can permission={'REMIND_WARRANTY'}>
          <Button
            onClick={() => {
              const warranty = getSelectedWarranty()
              if (!warranty) return

              if (!warranty.customer?.email) {
                return toast.warning(
                  'Khách hàng chưa có email, không thể gửi nhắc hạn.',
                )
              }

              setSelectedWarranty(warranty)
              setShowSendReminderDialog(true)
            }}
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary/10 hover:text-primary"
          >
            <IconMail className="mr-2 size-4" />
            Nhắc hạn BH
          </Button>
        </Can>

        <DataTableViewOptions table={table} />
      </div>

      {showCreateWarrantyQuoteDialog && selectedWarranty && (
        <CreateWarrantyQuoteDialog
          open={showCreateWarrantyQuoteDialog}
          onOpenChange={setShowCreateWarrantyQuoteDialog}
          warranty={selectedWarranty}
        />
      )}

      {showSendReminderDialog && selectedWarranty && (
        <SendWarrantyReminderDialog
          open={showSendReminderDialog}
          onOpenChange={setShowSendReminderDialog}
          warranty={selectedWarranty}
        />
      )}
    </div>
  )
}

export { DataTableToolbar }
