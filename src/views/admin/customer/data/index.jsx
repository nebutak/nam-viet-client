import { IconRefreshDot } from '@tabler/icons-react'
import { CheckCircleIcon } from 'lucide-react'

export const types = [
  {
    value: 'company',
    label: 'Khách công ty',
  },
  {
    value: 'partner',
    label: 'Khách đối tác',
  },
]

export const statuses = [
  {
    value: 'pending',
    label: 'Chờ duyệt',
    icon: IconRefreshDot,
    color: 'text-yellow-500',
  },
  {
    value: 'accepted',
    label: 'Đã duyệt',
    icon: CheckCircleIcon,
    color: 'text-green-500',
  },
]

export const invoiceTypes = [
  {
    value: 'physical',
    label: 'Hóa đơn vật lý',
  },
  {
    value: 'digital',
    label: 'Hóa đơn điện tử',
  },
  {
    value: 'warranty',
    label: 'Hóa đơn bảo hành',
  },
  {
    value: 'service',
    label: 'Hóa đơn dịch vụ',
  },
  {
    value: 'common_invoice',
    label: 'Hóa đơn thường',
  },
]
