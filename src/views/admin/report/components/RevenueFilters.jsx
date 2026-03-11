import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Search, RotateCcw } from 'lucide-react'
import './RevenueFilters.css'

const RevenueFilters = ({ onFilterChange }) => {
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [filters, setFilters] = useState({
    fromDate: thirtyDaysAgo,
    toDate: today,
    groupBy: 'day',
  })

  const [selectedPreset, setSelectedPreset] = useState('30days')

  const presets = [
    { label: 'Hôm nay', value: 'today', days: 0 },
    { label: '7 ngày', value: '7days', days: 7 },
    { label: '30 ngày', value: '30days', days: 30 },
    { label: 'Tháng này', value: 'thisMonth', days: null },
    { label: 'Tháng trước', value: 'lastMonth', days: null },
  ]

  const handlePresetClick = (preset) => {
    const today = new Date()
    let fromDate, toDate

    switch (preset.value) {
      case 'today':
        fromDate = today.toISOString().split('T')[0]
        toDate = today.toISOString().split('T')[0]
        break
      case '7days':
      case '30days':
        fromDate = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        toDate = today.toISOString().split('T')[0]
        break
      case 'thisMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        toDate = today.toISOString().split('T')[0]
        break
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        fromDate = lastMonth.toISOString().split('T')[0]
        toDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0]
        break
      default:
        return
    }

    setSelectedPreset(preset.value)
    setFilters((prev) => ({ ...prev, fromDate, toDate }))
  }

  const handleInputChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setSelectedPreset('') // Reset preset when manual input
  }

  const handleApply = () => {
    onFilterChange(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      fromDate: thirtyDaysAgo,
      toDate: today,
      groupBy: 'day',
    }
    setFilters(resetFilters)
    setSelectedPreset('30days')
    onFilterChange(resetFilters)
  }

  return (
    <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Date Presets */}
          <div>
            <Label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="h-4 w-4 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Khoảng thời gian nhanh
            </Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant={selectedPreset === preset.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className={`h-10 px-4 font-medium rounded-lg transition-all duration-200 ${
                    selectedPreset === preset.value
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'border-2 border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-400 dark:bg-gray-700 dark:text-gray-300 transform hover:scale-105'
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Inputs */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4 pt-6 border-t-2 border-gray-100">
            <div className="flex flex-1 gap-4">
              {/* From Date */}
              <div className="flex-1">
                <Label htmlFor="fromDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Từ ngày
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="fromDate"
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleInputChange('fromDate', e.target.value)}
                    className="w-full h-11 px-4 text-base border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                </div>
              </div>

              {/* To Date */}
              <div className="flex-1">
                <Label htmlFor="toDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Đến ngày
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="toDate"
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleInputChange('toDate', e.target.value)}
                    className="w-full h-11 px-4 text-base border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                </div>
              </div>

              {/* Group By */}
              <div className="flex-1">
                <Label htmlFor="groupBy" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nhóm theo
                </Label>
                <div className="relative mt-1">
                  <select
                    id="groupBy"
                    value={filters.groupBy}
                    onChange={(e) => handleInputChange('groupBy', e.target.value)}
                    className="mt-1 w-full h-11 px-4 text-base border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm cursor-pointer font-medium text-gray-700"
                  >
                    <option value="day">📅 Ngày</option>
                    <option value="week">📊 Tuần</option>
                    <option value="month">📆 Tháng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleApply}
                className="h-11 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Search className="mr-2 h-4 w-4" />
                Áp dụng
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="h-11 px-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium rounded-lg transition-all duration-200"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Đặt lại
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RevenueFilters
