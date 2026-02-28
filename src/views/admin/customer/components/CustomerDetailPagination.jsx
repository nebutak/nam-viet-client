import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'

import { Button } from '@/components/custom/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CustomerDetailPagination = ({
  page,
  limit,
  totalItems,
  totalPages,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <div className="flex items-center justify-between overflow-auto px-2">
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-xs font-medium">
          Trang {page} trong {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-6 w-6 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-6 w-6 p-0"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-6 w-6 p-0"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-6 w-6 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { CustomerDetailPagination }
