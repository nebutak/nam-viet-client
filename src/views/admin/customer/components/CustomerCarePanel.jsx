// src/views/admin/customer/components/CustomerCarePanel.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { dateFormat } from '@/utils/date-format'

import {
  getCustomerOverview,
  getCustomerTimeline,
} from '@/stores/CustomerTimelineSlice'

import {
  MessageCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Ticket,
  ListChecks,
} from 'lucide-react'

const CustomerCarePanel = ({ customerId }) => {
  const dispatch = useDispatch()

  const { overview, timeline, loadingOverview, loadingTimeline, error } =
    useSelector((state) => state.customerTimeline)

  useEffect(() => {
    if (!customerId) return

    dispatch(getCustomerOverview(customerId))
    dispatch(
      getCustomerTimeline({
        customerId,
        params: {
          limit: 50,
        },
      }),
    )
  }, [customerId, dispatch])

  const safeOverview =
    overview && overview.customerId === customerId
      ? overview
      : {
          openTickets: 0,
          pendingTasks: 0,
          lastCare: null,
          ticketSummary: null,
          taskSummary: null,
        }

  const renderOverview = () => {
    if (loadingOverview) {
      return (
        <div className="grid gap-3 md:grid-cols-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )
    }

    const ticketSummary = safeOverview.ticketSummary || {}
    const taskSummary = safeOverview.taskSummary || {}

    return (
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Phiếu hỗ trợ đang mở</span>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeOverview.openTickets}</div>
            {ticketSummary.total != null && (
              <div className="mt-1 text-xs text-muted-foreground">
                Tổng: {ticketSummary.total} phiếu
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Công việc chưa xử lý</span>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeOverview.pendingTasks}
            </div>
            {taskSummary.total != null && (
              <div className="mt-1 text-xs text-muted-foreground">
                Tổng: {taskSummary.total} công việc
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Lần chăm sóc gần nhất</span>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {safeOverview.lastCare?.at
                ? dateFormat(safeOverview.lastCare.at, true)
                : 'Chưa ghi nhận'}
            </div>
            {safeOverview.lastCare?.sourceType && (
              <div className="mt-1 text-xs text-muted-foreground">
                Loại: {mapLastCareSourceTypeLabel(safeOverview.lastCare)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Tổng quan phiếu/công việc</span>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            {ticketSummary.byStatus && (
              <div>
                <div className="font-medium text-foreground">Phiếu hỗ trợ</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <StatusChip label="Mở" value={ticketSummary.byStatus.open} />
                  <StatusChip
                    label="Đang xử lý"
                    value={ticketSummary.byStatus.in_progress}
                  />
                  <StatusChip
                    label="Chờ phản hồi KH"
                    value={ticketSummary.byStatus.pending_customer}
                  />
                  <StatusChip
                    label="Đã xử lý"
                    value={ticketSummary.byStatus.resolved}
                  />
                  <StatusChip
                    label="Đã đóng"
                    value={ticketSummary.byStatus.closed}
                  />
                </div>
              </div>
            )}

            {taskSummary.byStatus && (
              <div className="pt-1">
                <div className="font-medium text-foreground">Công việc</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <StatusChip label="Mở" value={taskSummary.byStatus.open} />
                  <StatusChip
                    label="Đang làm"
                    value={taskSummary.byStatus.in_progress}
                  />
                  <StatusChip
                    label="Hoàn thành"
                    value={taskSummary.byStatus.completed}
                  />
                  <StatusChip
                    label="Hủy"
                    value={taskSummary.byStatus.canceled}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTimelineIcon = (item) => {
    switch (item.type) {
      case 'ticket':
        return <Ticket className="h-4 w-4 text-blue-500" />
      case 'note':
        return <FileText className="h-4 w-4 text-amber-500" />
      case 'task':
        return <ListChecks className="h-4 w-4 text-purple-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

  const getTimelineBadge = (item) => {
    if (item.type === 'ticket') {
      return (
        <Badge variant="outline" className="text-[11px]">
          Phiếu hỗ trợ
        </Badge>
      )
    }

    if (item.type === 'note') {
      return (
        <Badge variant="secondary" className="text-[11px]">
          Ghi chú khách hàng
        </Badge>
      )
    }

    if (item.type === 'task') {
      return (
        <Badge variant="default" className="text-[11px]">
          Công việc
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="text-[11px]">
        Hoạt động
      </Badge>
    )
  }

  const getTimelineSecondary = (item) => {
    if (item.type === 'ticket') {
      const raw = item.raw || {}
      const code = raw.code || raw.ticketCode
      return [
        code ? `Mã phiếu: ${code}` : null,
        item.status ? `Trạng thái: ${item.status}` : null,
        item.priority ? `Ưu tiên: ${item.priority}` : null,
      ]
        .filter(Boolean)
        .join(' • ')
    }

    if (item.type === 'note') {
      return [item.noteType && `Loại ghi chú: ${item.noteType}`]
        .filter(Boolean)
        .join(' • ')
    }

    if (item.type === 'task') {
      return [
        item.status && `Trạng thái: ${item.status}`,
        item.priority && `Ưu tiên: ${item.priority}`,
      ]
        .filter(Boolean)
        .join(' • ')
    }

    return ''
  }

  const renderTimeline = () => {
    if (loadingTimeline) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )
    }

    if (!timeline.items || timeline.items.length === 0) {
      return (
        <div className="text-center text-sm text-muted-foreground">
          Chưa có lịch sử tương tác nào.
        </div>
      )
    }

    return (
      <ScrollArea className="h-[360px] pr-3">
        <div className="space-y-4">
          {timeline.items.map((item) => {
            const occurredAt = item.occurredAt || item.raw?.createdAt
            const secondary = getTimelineSecondary(item)

            return (
              <div
                key={`${item.type}-${item.id}-${occurredAt || ''}`}
                className="flex gap-3"
              >
                <div className="mt-1 flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getTimelineIcon(item)}
                  </div>
                  <div className="mt-1 h-full w-px flex-1 bg-muted" />
                </div>

                <div className="flex-1 space-y-1 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">
                      {item.title || 'Hoạt động'}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {occurredAt ? dateFormat(occurredAt) : ''}
                    </span>
                  </div>

                  {secondary && (
                    <div className="text-xs text-muted-foreground">
                      {secondary}
                    </div>
                  )}

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {getTimelineBadge(item)}
                    {item.raw?.createdByUser?.fullName && (
                      <span className="text-[11px] text-muted-foreground">
                        Thực hiện bởi: {item.raw.createdByUser.fullName}
                      </span>
                    )}
                    {item.raw?.assignedToUser?.fullName &&
                      item.type === 'task' && (
                        <span className="text-[11px] text-muted-foreground">
                          Phụ trách: {item.raw.assignedToUser.fullName}
                        </span>
                      )}
                  </div>

                  <Separator className="mt-2" />
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {renderOverview()}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Lịch sử chăm sóc / tương tác</h3>
        </div>
        {renderTimeline()}
      </div>
    </div>
  )
}

const StatusChip = ({ label, value }) => {
  if (value == null) return null
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px]">
      {label}:{' '}
      <span className="ml-1 font-semibold text-foreground">{value}</span>
    </span>
  )
}

const mapLastCareSourceTypeLabel = (lastCare) => {
  switch (lastCare.sourceType) {
    case 'note':
      return 'Ghi chú khách hàng'
    case 'task':
      return 'Công việc'
    case 'ticket_message':
      return 'Trao đổi phiếu hỗ trợ'
    default:
      return lastCare.sourceType
  }
}

export default CustomerCarePanel
