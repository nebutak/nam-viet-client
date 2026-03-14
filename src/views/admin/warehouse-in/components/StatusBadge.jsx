import { Badge } from '@/components/ui/badge'
import { getStatusConfig } from '../data'

export function StatusBadge({ isPosted }) {
    const status = isPosted ? 'posted' : 'unposted'
    const config = getStatusConfig(status)
    const Icon = config.icon
    return (
        <Badge variant="outline" className={`flex items-center gap-1 text-xs ${config.badgeClass}`}>
            {Icon && <Icon className="h-3 w-3" />}
            {config.label}
        </Badge>
    )
}
