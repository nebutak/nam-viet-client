import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MobileIcon, PlusIcon } from '@radix-ui/react-icons'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Mail, MapPin, Pencil } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '@/stores/ProductSlice'
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { getCustomers } from '@/stores/CustomerSlice'
import UpdateCustomerDialog from '../../customer/components/UpdateCustomerDialog'
import { moneyFormat, toVietnamese } from '@/utils/money-format'
import { Separator } from '@/components/ui/separator'
import { createInvoice } from '@/stores/InvoiceSlice'
import { toast } from 'sonner'
import { getInvoiceDetail } from '@/stores/InvoiceSlice'
import { dateFormat } from '@/utils/date-format'
import { getSetting } from '@/stores/SettingSlice'
import { IconFileTypePdf, IconDatabasePlus } from '@tabler/icons-react'
import MultipleSelector from '@/components/custom/MultiSelector'
import { createWarrantyQuoteSchema } from '../schema'

const CreateWarrantyQuoteDialog = ({
  open,
  onOpenChange,
  warranty,
  showTrigger = false,
}) => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product.products)
  const loading = useSelector((state) => state.invoice.loading)
  const authUser =
    useSelector((state) => state.auth.authUserWithRoleHasPermissions) || {}

  const [selectedService, setSelectedService] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [giveaway, setGiveaway] = useState(0)
  const [customPrice, setCustomPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [hasPrintQuotation, setHasPrintQuotation] = useState(false)
  const [hasPrintInvoice, setHasPrintInvoice] = useState(false)
  const [invoice, setInvoice] = useState(null)
  const [generalInfo, setGeneralInfo] = useState(null)

  const form = useForm({
    resolver: zodResolver(createWarrantyQuoteSchema),
    defaultValues: { note: warranty?.note || '', status: 'pending' },
  })

  useEffect(() => {
    if (selectedService) {
      setCustomPrice(selectedService.price)
      setGiveaway(0)
      setDiscount(0)
    } else {
      setCustomPrice(0)
    }
  }, [selectedService])

  const originalEnd = warranty?.endDate ? new Date(warranty.endDate) : null
  const newStart = originalEnd ? new Date(originalEnd) : null
  if (newStart) newStart.setDate(newStart.getDate() + 1)

  const totalMonths = quantity + giveaway
  const newEnd = newStart && totalMonths ? new Date(newStart) : null
  if (newEnd) newEnd.setMonth(newEnd.getMonth() + totalMonths)

  const serviceOptions = products
    .filter((p) => p?.category?.code === 'DICHVU')
    .map((p) => ({
      label: `${p.name} - ${moneyFormat(p.price)} / tháng`,
      value: p.id,
    }))

  const handleSelectService = (value) => {
    const id = value?.[0]?.value
    const prod = products.find((p) => p.id === id)
    setSelectedService(prod || null)
    setQuantity(1)
  }

  const subTotal = selectedService ? quantity * customPrice : 0
  const totalAmount = Math.max(0, subTotal - discount)

  const onSubmit = async (data) => {
    if (!selectedService) {
      toast.error('Vui lòng chọn dịch vụ gia hạn bảo hành')
      return
    }

    if (quantity < 1) {
      toast.error('Số tháng trả phí phải lớn hơn 0')
      return
    }

    const chargedMonths = quantity
    const subTotal = chargedMonths * customPrice
    const totalAmount = Math.max(0, subTotal - discount)

    const prices = selectedService.prices ?? []
    const latestPriceEntry = [...prices].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0]

    const items = [
      {
        productId: selectedService.id,
        productName: selectedService.name,
        productType: selectedService.type,
        image: selectedService.image,
        quantity,
        giveaway,
        price: customPrice,
        taxAmount: 0,
        subTotal,
        discount,
        total: totalAmount,
        note: 'Gia hạn bảo hành',
        options: [],
        warranty: warranty?.id.toString(),
        periodMonths: totalMonths,
        warrantyCost: totalAmount,
        applyWarranty: false,
        startDate: newStart?.toISOString(),
        endDate: newEnd?.toISOString(),
        unitName: latestPriceEntry?.unitName,
        unitId: latestPriceEntry?.unitId,
      },
    ]

    const payload = {
      userId: authUser.id,
      customerId: warranty.customerId,
      date: new Date().toISOString(),
      note: data.note || `Gia hạn BH cho ${warranty.product.name}`,
      type: 'warranty',
      taxAmount: 0,
      amount: totalAmount,
      discount,
      subTotal,
      status: data.status,
      items,
      totalAmount,
      originalWarrantyId: warranty.id,
      createReceipt: false,
    }

    try {
      const created = await dispatch(createInvoice(payload)).unwrap()

      if (hasPrintInvoice || hasPrintQuotation) {
        const inv = await dispatch(getInvoiceDetail(created.id)).unwrap()

        if (hasPrintInvoice) {
          const info = await dispatch(
            getSetting('general_information'),
          ).unwrap()
          setGeneralInfo(info)
          setInvoice(inv)
        }

        if (hasPrintQuotation) {
          toast.success('Đã xuất báo giá')
        }

        setTimeout(() => {
          setInvoice(null)
          setHasPrintInvoice(false)
          setHasPrintQuotation(false)
          form.reset()
          onOpenChange?.(false)
        }, 1000)
      } else {
        toast.success('Tạo báo giá gia hạn thành công!')
        form.reset()
        onOpenChange?.(false)
      }
    } catch (e) {
      toast.error('Lỗi khi tạo báo giá')
    }
  }

  const [showUpdateCustomer, setShowUpdateCustomer] = useState(false)

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getCustomers())
    dispatch(getSetting('general_information'))
  }, [dispatch])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 size-4" />
              Gia hạn BH
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="md:h-auto md:max-w-full">
          <DialogHeader>
            <DialogTitle>Báo giá gia hạn bảo hành</DialogTitle>
            <DialogDescription>
              Chọn dịch vụ, số tháng trả phí, tặng thêm, giảm giá
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] overflow-auto md:max-h-[75vh]">
            <Form {...form}>
              <form
                id="create-warranty-quote"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="flex-1 space-y-6 rounded-lg border p-4 lg:max-w-[79vw]">
                    <h2 className="text-lg font-semibold">Thông tin gia hạn</h2>

                    <div className="rounded-lg border bg-muted/30 p-3">
                      <div className="text-sm font-medium">Sản phẩm gốc</div>
                      <div className="mt-1 text-sm">
                        <span className="font-medium">
                          {warranty?.product?.name}
                        </span>
                        {' – '}
                        <span className="text-muted-foreground">
                          {warranty?.product?.code}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Hóa đơn: {warranty?.invoice?.code} (
                        {dateFormat(warranty?.invoice?.date)})
                        <br />
                        Thời hạn hiện tại: {dateFormat(
                          warranty?.startDate,
                        )} → <strong>{dateFormat(warranty?.endDate)}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-6">
                      <div className="md:col-span-2 lg:col-span-2">
                        <FormLabel required>Dịch vụ gia hạn</FormLabel>
                        <MultipleSelector
                          placeholder="Chọn dịch vụ"
                          options={serviceOptions}
                          onChange={handleSelectService}
                          maxSelected={1}
                          emptyIndicator={
                            <p className="text-center text-xs text-muted-foreground">
                              Không có dịch vụ nào
                            </p>
                          }
                        />
                      </div>

                      <div>
                        <FormLabel required>Trả phí (tháng)</FormLabel>
                        <Input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(1, Number(e.target.value) || 1),
                            )
                          }
                          className="h-9"
                        />
                      </div>

                      <div>
                        <FormLabel>Tặng thêm (tháng)</FormLabel>
                        <Input
                          type="number"
                          min={0}
                          value={giveaway}
                          onChange={(e) =>
                            setGiveaway(
                              Math.max(0, Number(e.target.value) || 0),
                            )
                          }
                          className="h-9"
                        />
                      </div>

                      <div>
                        <FormLabel required>Đơn giá / tháng</FormLabel>
                        <Input
                          type="number"
                          min={0}
                          value={customPrice}
                          onChange={(e) =>
                            setCustomPrice(Number(e.target.value) || 0)
                          }
                          className="h-9"
                        />
                      </div>

                      <div>
                        <FormLabel>Giảm giá</FormLabel>
                        <Input
                          type="number"
                          min={0}
                          value={discount}
                          onChange={(e) =>
                            setDiscount(
                              Math.max(0, Number(e.target.value) || 0),
                            )
                          }
                          className="h-9"
                        />
                      </div>
                    </div>

                    {selectedService && (
                      <div className="overflow-x-auto rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-secondary text-xs">
                              <TableHead className="w-8">TT</TableHead>
                              <TableHead>Dịch vụ</TableHead>
                              <TableHead className="w-16">Trả phí</TableHead>
                              <TableHead className="w-16">Tặng</TableHead>
                              <TableHead className="w-24 text-end">
                                Đơn giá
                              </TableHead>
                              <TableHead className="w-24 text-end">
                                Tạm tính
                              </TableHead>
                              <TableHead className="w-24 text-end">
                                Giảm giá
                              </TableHead>
                              <TableHead className="w-28 text-end">
                                Thành tiền
                              </TableHead>
                              <TableHead className="w-32">
                                Thời hạn mới
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>1</TableCell>
                              <TableCell className="font-medium">
                                {selectedService.name}
                              </TableCell>
                              <TableCell>{quantity}</TableCell>
                              <TableCell className="font-medium text-green-600">
                                +{giveaway}
                              </TableCell>
                              <TableCell className="text-end">
                                {moneyFormat(customPrice)}
                              </TableCell>
                              <TableCell className="text-end">
                                {moneyFormat(subTotal)}
                              </TableCell>
                              <TableCell className="text-end text-red-600">
                                -{moneyFormat(discount)}
                              </TableCell>
                              <TableCell className="text-end font-medium">
                                {moneyFormat(totalAmount)}
                              </TableCell>
                              <TableCell className="text-xs">
                                {newStart && dateFormat(newStart)} →{' '}
                                <strong>{newEnd && dateFormat(newEnd)}</strong>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div className="bg-muted/30 p-2 text-xs text-muted-foreground">
                          {quantity} tháng trả phí × {moneyFormat(customPrice)}{' '}
                          + {giveaway} tháng tặng = {totalMonths} tháng bảo hành
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
                      <div>
                        <FormField
                          control={form.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ghi chú báo giá</FormLabel>
                              <FormControl>
                                <Textarea rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-bold">Tạm tính:</span>
                          <span>{moneyFormat(subTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold">Thuế:</span>
                          <span>{moneyFormat(0)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span className="font-bold">Giảm giá:</span>
                          <span>-{moneyFormat(discount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between border-t py-2">
                          <span className="font-bold">Tổng tiền:</span>
                          <span className="font-bold text-primary">
                            {moneyFormat(totalAmount)}
                          </span>
                        </div>
                        <div className="text-sm">
                          Bằng chữ:{' '}
                          <span className="font-medium">
                            {toVietnamese(totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full rounded-lg border p-4 lg:w-72">
                    <h2 className="py-2 text-lg font-semibold">Khách hàng</h2>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?bold=true&background=random&name=${warranty?.customer?.name}`}
                          />
                          <AvatarFallback>
                            {warranty?.customer?.name?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {warranty?.customer?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {warranty?.customer?.code}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">Thông tin</span>
                          <button
                            type="button"
                            onClick={() => setShowUpdateCustomer(true)}
                            title="Cập nhật"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center">
                            <MobileIcon className="mr-2 h-4 w-4" />
                            <a href={`tel:${warranty?.customer?.phone}`}>
                              {warranty?.customer?.phone}
                            </a>
                          </div>
                          {warranty?.customer?.email && (
                            <div className="flex items-center text-muted-foreground">
                              <Mail className="mr-2 h-4 w-4" />
                              <a href={`mailto:${warranty?.customer?.email}`}>
                                {warranty?.customer?.email}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {warranty?.customer?.address || 'Chưa cập nhật'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:space-x-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>
            </DialogClose>

            <Button
              form="create-warranty-quote"
              disabled={
                loading || !selectedService || customPrice <= 0 || quantity < 1
              }
              onClick={() => setHasPrintQuotation(true)}
              className="w-full sm:w-auto"
            >
              <IconFileTypePdf className="me-2 h-4 w-4" />
              Lưu & In báo giá
            </Button>

            <Button
              form="create-warranty-quote"
              disabled={
                loading || !selectedService || customPrice <= 0 || quantity < 1
              }
              onClick={() => setHasPrintInvoice(true)}
              className="w-full sm:w-auto"
            >
              <IconFileTypePdf className="me-2 h-4 w-4" />
              Lưu & In
            </Button>

            <Button
              form="create-warranty-quote"
              disabled={
                loading || !selectedService || customPrice <= 0 || quantity < 1
              }
              className="w-full sm:w-auto"
            >
              <IconDatabasePlus className="me-2 h-4 w-4" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showUpdateCustomer && (
        <UpdateCustomerDialog
          open={showUpdateCustomer}
          onOpenChange={setShowUpdateCustomer}
          customer={warranty?.customer}
          showTrigger={false}
        />
      )}

      {invoice && generalInfo && (
        <PrintInvoiceView invoice={invoice} setting={generalInfo} />
      )}
    </>
  )
}

export default CreateWarrantyQuoteDialog
