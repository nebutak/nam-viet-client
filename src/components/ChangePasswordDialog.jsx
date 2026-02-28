import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { PlusIcon } from 'lucide-react'
import { PasswordInput } from './custom/PasswordInput'
import { changePasswordSchema } from './schema'
import { changePassword } from '@/stores/UserSlice'

const ChangePasswordDialog = ({ isOpen, onOpenChange, showTrigger = true }) => {
  const loading = useSelector((state) => state.user.loading)

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      passwordConfirmation: '',
    },
  })

  const dispatch = useDispatch()
  const onSubmit = async (data) => {
    try {
      await dispatch(changePassword(data)).unwrap()
      form.reset()
      onOpenChange?.(false)
    } catch (error) {
      console.log('Submit error:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="mx-2" variant="outline" size="sm">
            <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            Thêm mới
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật mật khẩu</DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin để cập nhật mật khẩu
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-auto md:max-h-[75vh]">
          <Form {...form}>
            <form id="update-password" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Mật khẩu cũ</FormLabel>
                      <FormControl>
                        <PasswordInput
                          tabIndex={1}
                          autoComplete="new-password"
                          placeholder="Nhập mật khẩu cũ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <PasswordInput
                          tabIndex={2}
                          autoComplete="new-password"
                          placeholder="Nhập mật khẩu mới"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="text-primary">
                        <strong className="text-destructive">Lưu ý:</strong> Mật
                        khẩu phải chứa ít nhất 8 ký tự, chữ hoa, chữ thường và
                        số.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Xác nhận khẩu</FormLabel>
                      <FormControl>
                        <PasswordInput
                          tabIndex={3}
                          autoComplete="new-password"
                          placeholder="Xác nhận lại mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset()
              }}
            >
              Hủy
            </Button>
          </DialogClose>

          <Button form="update-password" loading={loading}>
            Cập nhật mật khẩu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordDialog
