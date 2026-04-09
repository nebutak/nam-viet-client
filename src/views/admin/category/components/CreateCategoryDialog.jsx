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
import { PlusIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { createCategory, getCategories } from '@/stores/CategorySlice'
import { createCategorySchema } from '../schema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { statuses, types } from '../data'
import { useEffect, useState } from 'react'

const CreateCategoryDialog = ({
  open,
  onOpenChange,
  showTrigger = true,
  contentClassName,
  overlayClassName,
  type,
  ...props
}) => {
  const loading = useSelector((state) => state.category.loading)
  const dispatch = useDispatch()

  // State cho loại danh mục (Sản phẩm / Nguyên liệu)
  const [categoryType, setCategoryType] = useState(type || 'PRODUCT')

  // Khi prop type thay đổi (ví dụ mở từ dialog khác), cập nhật state
  useEffect(() => {
    if (open && type) {
      setCategoryType(type)
    }
  }, [open, type])

  // Khi categoryType thay đổi, load lại danh mục cha tương ứng
  useEffect(() => {
    if (open) {
      dispatch(getCategories({ type: categoryType }))
    }
  }, [open, categoryType, dispatch])

  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      categoryName: '',
      categoryCode: '',
      status: 'active',
      parentId: null,
    },
  })

  // state.category.categories usually is { data: [...], meta: {...} } or [...]
  const categoriesList = useSelector(
    (state) => state.category.categories?.data || (Array.isArray(state.category.categories) ? state.category.categories : [])
  )

  // Lọc danh mục cha theo loại đã chọn
  const filteredParentCategories = categoriesList.filter(
    (cat) => cat.type === categoryType
  )

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        type: categoryType,
        parentId: data.parentId ? Number(data.parentId) : null,
      }
      await dispatch(createCategory({ data: payload, params: { type: categoryType } })).unwrap()
      form.reset()
      onOpenChange?.(false)
    } catch (error) {
      console.log('Submit error: ', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="mx-2" variant="outline" size="sm">
            <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            Thêm mới
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className={cn("md:h-auto md:max-w-2xl", contentClassName)}
        overlayClassName={overlayClassName}
      >
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Điền vào chi tiết phía dưới để thêm danh mục mới
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-auto md:max-h-[75vh]">
          <Form {...form}>
            <form id="create-category" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Loại danh mục */}
                <FormItem className="mb-2 space-y-1">
                  <FormLabel required={true}>Loại danh mục</FormLabel>
                  <Select
                    value={categoryType}
                    onValueChange={(val) => {
                      setCategoryType(val)
                      // Reset danh mục cha khi đổi loại
                      form.setValue('parentId', null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUCT">Sản phẩm</SelectItem>
                      <SelectItem value="MATERIAL">Nguyên liệu</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormField
                  control={form.control}
                  name="categoryCode"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel required={true}>Mã danh mục</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập mã danh mục"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase())
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel required={true}>Tên danh mục</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Danh mục cha</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                        defaultValue={field.value?.toString() || ''}
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Không chọn --" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">-- Không chọn --</SelectItem>
                          {filteredParentCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel required={true}>
                        Chọn trạng thái danh mục
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {statuses.map((status, index) => (
                            <FormItem
                              key={index}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={status.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {status.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
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

          <Button form="create-category" loading={loading}>
            Thêm mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCategoryDialog

