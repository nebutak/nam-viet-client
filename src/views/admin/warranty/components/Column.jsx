import { Badge } from '@/components/ui/badge'
import { DataTableRowActions } from './DataTableRowAction'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import { dateFormat } from '@/utils/date-format'
import { normalizeText } from '@/utils/normalize-text'
import { statuses } from '../data'
import ViewInvoiceDialog from '../../invoice/components/ViewInvoiceDialog'
import InvoiceDialog from '../../invoice/components/InvoiceDialog'
import Can from '@/utils/can'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import UpdateWarrantyStatusDialog from './UpdateWarrantyStatusDialog'

export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mx-2 translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mx-2 translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'invoiceCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã HĐ" />
    ),
    cell: function Cell({ row }) {
      const [showViewInvoiceDialog, setShowViewInvoiceDialog] = useState(false)
      const [showUpdateInvoiceDialog, setShowUpdateInvoiceDialog] = useState(false)
      const code = row.original.invoice?.code

      return (
        <>
          <Can permission={'GET_INVOICE'}>
            {showViewInvoiceDialog && (
              <ViewInvoiceDialog
                open={showViewInvoiceDialog}
                onOpenChange={setShowViewInvoiceDialog}
                invoiceId={row.original.invoiceId}
                showTrigger={false}
                onEdit={() => {
                  setShowViewInvoiceDialog(false)
                  setTimeout(() => {
                    setShowUpdateInvoiceDialog(true)
                  }, 100)
                }}
              />
            )}

            {showUpdateInvoiceDialog && (
              <InvoiceDialog
                open={showUpdateInvoiceDialog}
                onOpenChange={setShowUpdateInvoiceDialog}
                invoiceId={row.original.invoiceId}
                showTrigger={false}
              />
            )}
          </Can>

          <span
            className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
            onClick={() => setShowViewInvoiceDialog(true)}
          >
            {code || '—'}
          </span>
        </>
      )
    },
  },

  {
    id: 'productName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sản phẩm" />
    ),
    cell: ({ row }) => {
      const name = row.original.product?.name
      return (
        <div className="max-w-[180px] truncate font-medium">{name || '—'}</div>
      )
    },
  },

  {
    id: 'customerInfo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khách hàng" />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer
      return (
        <div className="flex flex-col">
          <span className="max-w-[150px] truncate font-medium">
            {customer?.name || '—'}
          </span>
          {customer?.phone && (
            <a
              href={`tel:${customer.phone}`}
              className="text-xs text-muted-foreground underline"
            >
              {customer.phone}
            </a>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const search = normalizeText(value)

      const customerName = row.original.customer?.name || ''
      const phone = row.original.customer?.phone || ''
      const productName = row.original.product?.name || ''
      const invoiceCode = row.original.invoice?.code || ''

      const fields = [customerName, phone, productName, invoiceCode]

      return fields.some((field) => normalizeText(field).includes(search))
    },
    enableColumnFilter: true,
  },

  {
    id: 'warrantyPeriod',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thời gian bảo hành" />
    ),
    cell: ({ row }) => {
      const start = row?.original?.startDate
      const end = row?.original?.endDate
      const period = row?.original?.periodMonths

      if (start && end) {
        return (
          <div className="flex flex-col text-sm">
            <span>{dateFormat(start)}</span>
            <span className="text-muted-foreground">
              → {dateFormat(end)} ({period} tháng)
            </span>
          </div>
        )
      }

      if (period) {
        return <span className="text-sm">{period} tháng</span>
      }

      return <span className="text-sm text-muted-foreground">—</span>
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const [openUpdateStatusDialog, setOpenUpdateStatusDialog] =
        useState(false)
      const statusValue = row.getValue('status')
      const status = statuses.find((s) => s.value === statusValue) || {
        label: statusValue,
        color: 'bg-gray-400',
      }

      return (
        <div className="flex w-[120px] items-center">
          {openUpdateStatusDialog && (
            <UpdateWarrantyStatusDialog
              open={openUpdateStatusDialog}
              onOpenChange={setOpenUpdateStatusDialog}
              warranty={row.original}
            />
          )}

          <Badge
            variant="outline"
            className={`${status.color} cursor-pointer border-0 text-white`}
            onClick={() => setOpenUpdateStatusDialog(true)}
            title="Nhấn để cập nhật trạng thái"
          >
            {status.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: 'nextReminder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nhắc bảo hành" />
    ),
    cell: ({ row }) => {
      const nextReminder = row.original.nextReminderDate || row.original.lastReminderDate;
      if (!nextReminder) return <span className="text-muted-foreground">—</span>

      const daysLeft = Math.ceil(
        (new Date(nextReminder) - new Date()) / (1000 * 60 * 60 * 24),
      )

      return (
        <div className="text-sm">
          <div>{dateFormat(nextReminder)}</div>
          {daysLeft > 0 && (
            <span className="text-xs text-orange-600">Còn {daysLeft} ngày</span>
          )}
          {daysLeft === 0 && (
            <span className="text-xs text-red-600">Hôm nay</span>
          )}
          {daysLeft < 0 && (
            <span className="text-xs text-red-600">
              Quá hạn {-daysLeft} ngày
            </span>
          )}
        </div>
      )
    },
  },

  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ghi chú" />
    ),
    cell: ({ row }) => {
      const note = row.getValue('note')
      return (
        <div className="max-w-[150px] truncate text-sm text-muted-foreground">
          {note || '—'}
        </div>
      )
    },
  },

  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cập nhật" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {dateFormat(row.getValue('updatedAt'))}
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thao tác" />
    ),
  },
]
