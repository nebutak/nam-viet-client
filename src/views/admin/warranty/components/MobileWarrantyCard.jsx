import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { dateFormat } from '@/utils/date-format'
import { statuses } from '../data'
import { DataTableRowActions } from './DataTableRowAction'
import UpdateWarrantyStatusDialog from './UpdateWarrantyStatusDialog'
import ViewInvoiceDialog from '../../invoice/components/ViewInvoiceDialog'
import InvoiceDialog from '../../invoice/components/InvoiceDialog'
import Can from '@/utils/can'

const MobileWarrantyCard = ({ row, isSelected, onToggleSelect }) => {
  const warranty = row.original
  const [openUpdateStatusDialog, setOpenUpdateStatusDialog] = useState(false)
  const [showViewInvoiceDialog, setShowViewInvoiceDialog] = useState(false)
  const [showUpdateInvoiceDialog, setShowUpdateInvoiceDialog] = useState(false)

  const status = statuses.find((s) => s.value === warranty.status) || {
    label: warranty.status,
    color: 'bg-gray-400',
  }

  const nextReminder = warranty.nextReminderDate || warranty.lastReminderDate

  return (
    <Card
      className={`relative mb-4 overflow-hidden shadow-sm transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5' : ''
        }`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-primary/20" />
      <CardContent className="p-4 pl-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="mt-1"
            />
            <div>
              <Can permission={'GET_INVOICE'}>
                {showViewInvoiceDialog && (
                  <ViewInvoiceDialog
                    open={showViewInvoiceDialog}
                    onOpenChange={setShowViewInvoiceDialog}
                    invoiceId={warranty.invoiceId}
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
                    invoiceId={warranty.invoiceId}
                    showTrigger={false}
                  />
                )}
              </Can>
              <div
                className="font-bold text-primary tracking-tight cursor-pointer hover:underline"
                onClick={() => setShowViewInvoiceDialog(true)}
              >
                HĐ: {warranty.invoice?.code || '—'}
              </div>
              <div className="text-sm font-medium text-gray-700 mt-0.5">
                {warranty.product?.name || '—'}
              </div>
            </div>
          </div>
          <div>
            {openUpdateStatusDialog && (
              <UpdateWarrantyStatusDialog
                open={openUpdateStatusDialog}
                onOpenChange={setOpenUpdateStatusDialog}
                warranty={warranty}
              />
            )}
            <Badge
              variant="outline"
              className={`${status.color} cursor-pointer border-0 text-white`}
              onClick={() => setOpenUpdateStatusDialog(true)}
            >
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-3 rounded-lg bg-gray-50/80 p-3 text-sm border">
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-500">Khách hàng:</span>
            <div className="font-medium text-gray-900 truncate">
              {warranty.customer?.name || '—'}
            </div>
            {warranty.customer?.phone && (
              <a
                href={`tel:${warranty.customer.phone}`}
                className="text-xs text-blue-600 hover:underline"
              >
                {warranty.customer.phone}
              </a>
            )}
          </div>

          <div>
            <span className="mb-1 block text-xs font-medium text-gray-500">Bảo hành:</span>
            {warranty.startDate && warranty.endDate ? (
              <div className="text-gray-900 leading-tight">
                <div className="text-xs">{dateFormat(warranty.startDate)} →</div>
                <div className="font-medium">{dateFormat(warranty.endDate)}</div>
                <div className="text-xs text-gray-500 mt-0.5">({warranty.periodMonths} tháng)</div>
              </div>
            ) : warranty.periodMonths ? (
              <div className="text-gray-900 font-medium">{warranty.periodMonths} tháng</div>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>

          <div>
            <span className="mb-1 block text-xs font-medium text-gray-500">Nhắc nhở:</span>
            {nextReminder ? (
              <div className="text-gray-900">
                <div className="font-medium">{dateFormat(nextReminder)}</div>
                {(() => {
                  const daysLeft = Math.ceil((new Date(nextReminder) - new Date()) / (1000 * 60 * 60 * 24))
                  if (daysLeft > 0) return <span className="text-xs text-orange-600 block">Còn {daysLeft} ngày</span>
                  if (daysLeft === 0) return <span className="text-xs text-red-600 font-medium block">Hôm nay</span>
                  if (daysLeft < 0) return <span className="text-xs text-red-600 font-medium block">Quá hạn {-daysLeft} ngày</span>
                  return null
                })()}
              </div>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div className="text-xs text-gray-400">
            Cập nhật: {dateFormat(warranty.updatedAt)}
          </div>
          <DataTableRowActions row={row} />
        </div>
      </CardContent>
    </Card>
  )
}

export default MobileWarrantyCard
