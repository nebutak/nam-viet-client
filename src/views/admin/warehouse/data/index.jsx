import { CheckCircleIcon, PauseCircle, Box, Archive } from 'lucide-react'

export const warehouseStatuses = [
    {
        value: 'active',
        label: 'Hoạt động',
        variant: 'default',
        icon: CheckCircleIcon,
    },
    {
        value: 'inactive',
        label: 'Khóa',
        variant: 'destructive',
        icon: PauseCircle,
    },
]

export const warehouseTypes = [
    {
        value: 'raw_material',
        label: 'Nguyên liệu',
        icon: Box,
        color: 'text-amber-600',
    },
    {
        value: 'goods',
        label: 'Hàng hóa',
        icon: Archive,
        color: 'text-purple-600',
    },
]
