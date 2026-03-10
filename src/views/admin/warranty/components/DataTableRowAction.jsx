import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/custom/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import Can from '@/utils/can'
import { DeleteWarrantyDialog } from './DeleteWarrantyDialog'
import UpdateWarrantyDialog from './UpdateWarrantyDialog'

const DataTableRowActions = ({ row }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)

  return (
    <>
      {showDeleteDialog && (
        <DeleteWarrantyDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          warranty={row.original}
          showTrigger={false}
        />
      )}

      {showUpdateDialog && (
        <UpdateWarrantyDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          warranty={row.original}
          showTrigger={false}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <Can permission="UPDATE_WARRANTY">
            <DropdownMenuItem
              onSelect={() => setShowUpdateDialog(true)}
              className="cursor-pointer text-orange-600 focus:bg-orange-50 focus:text-orange-600"
            >
              Sửa
              <DropdownMenuShortcut>
                <IconPencil className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Can>

          <Can permission="UPDATE_WARRANTY">
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-500"
            >
              Xóa
              <DropdownMenuShortcut>
                <IconTrash className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { DataTableRowActions }
