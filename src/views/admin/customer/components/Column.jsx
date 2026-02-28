import { DataTableRowActions } from './DataTableRowAction'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import { dateFormat } from '@/utils/date-format'
import { types } from '../data'
import { normalizeText } from '@/utils/normalize-text'
import CustomerDetailDialog from './CustomerDetailDialog'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'

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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã KH" />
    ),
    cell: function Cell({ row }) {
      const [showCustomerDetailDialog, setShowCustomerDetailDialog] =
        useState(false)

      return (
        <div>
          <div
            onClick={() => setShowCustomerDetailDialog(true)}
            className="w-20 cursor-pointer font-medium text-blue-600 hover:underline"
            title={row.getValue('code')}
          >
            {row.getValue('code')}
          </div>

          {showCustomerDetailDialog && (
            <CustomerDetailDialog
              open={showCustomerDetailDialog}
              onOpenChange={setShowCustomerDetailDialog}
              customer={row.original}
              showTrigger={false}
            />
          )}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khách hàng" />
    ),
    cell: ({ row }) => {
      const name = row.original?.name
      const phone = row.original?.phone

      return (
        <div className="flex flex-col gap-1">
          <div className="whitespace-normal break-words font-medium">
            {name}
          </div>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="text-sm text-primary underline dark:text-secondary-foreground"
            >
              {phone}
            </a>
          )}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      const name = normalizeText(row.original.name)
      const phone = normalizeText(row.original.phone || '')
      const searchValue = normalizeText(value)

      return name.includes(searchValue) || phone.includes(searchValue)
    },
  },

  {
    accessorKey: 'creator',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Người tạo" />
    ),
    cell: ({ row }) => (
      <div className="w-32 truncate" title={row.original?.creator?.fullName}>
        {row.original?.creator?.fullName}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'invoiceCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SL đơn" />
    ),
    cell: ({ row }) => (
      <div className="w-16 text-center">{row.getValue('invoiceCount')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại khách hàng" />
    ),
    cell: ({ row }) => {
      const typeValue = row.getValue('type')
      const type = types.find((t) => t.value === typeValue)

      return <div className="flex w-[150px] items-center">{type?.label}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original?.type)
    },
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => <span>{dateFormat(row.getValue('createdAt'), true)}</span>,
  },

  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thao tác" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
