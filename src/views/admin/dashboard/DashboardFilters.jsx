import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsEditMode, toggleEditMode, resetLayout } from '../../../stores/DashboardSlice'
import { CalendarIcon, SlidersHorizontal, Settings2, RotateCcw } from 'lucide-react'

export const DashboardFilters = ({ period, setPeriod, warehouseId, setWarehouseId }) => {
    const dispatch = useDispatch()
    const isEditMode = useSelector(selectIsEditMode)

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-background borderb shadow-sm mb-6 rounded-xl gap-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Date Filter */}
                <div className="relative">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="flex items-center gap-2 px-8 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 appearance-none outline-none cursor-pointer"
                    >
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="custom">Tùy chọn...</option>
                    </select>
                    <CalendarIcon className="h-4 w-4 absolute left-3 top-2.5 pointer-events-none text-muted-foreground" />
                </div>

                {/* Warehouse Filter */}
                <div className="relative">
                    <select
                        value={warehouseId}
                        onChange={(e) => setWarehouseId(e.target.value)}
                        className="flex items-center gap-2 px-8 py-2 border rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground appearance-none outline-none cursor-pointer bg-background"
                    >
                        <option value="all">Tất cả Kho hàng</option>
                        <option value="HQ">Kho Tổng - HCM</option>
                        <option value="W1">Kho Chi nhánh 1</option>
                    </select>
                    <SlidersHorizontal className="h-4 w-4 absolute left-3 top-2.5 pointer-events-none text-muted-foreground" />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {isEditMode && (
                    <button
                        onClick={() => dispatch(resetLayout())}
                        className="flex items-center gap-2 px-4 py-2 border border-destructive/50 text-destructive rounded-md text-sm font-medium hover:bg-destructive/10"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset Layout
                    </button>
                )}
                <button
                    onClick={() => dispatch(toggleEditMode())}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isEditMode
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                        : 'border hover:bg-accent hover:text-accent-foreground'
                        }`}
                >
                    <Settings2 className="h-4 w-4" />
                    {isEditMode ? 'Hoàn tất Chỉnh sửa' : 'Tùy chỉnh Dashboard'}
                </button>
            </div>
        </div>
    )
}
