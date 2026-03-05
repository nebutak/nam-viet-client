import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2 } from 'lucide-react'
import { createImportTransaction, getStockTransactions } from '@/stores/StockTransactionSlice'
import { toast } from 'sonner'

const detailSchema = z.object({
    productId: z.coerce.number().int().positive('Chọn sản phẩm'),
    quantity: z.coerce.number().positive('SL phải > 0'),
    unitPrice: z.coerce.number().min(0).optional(),
    batchNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    notes: z.string().optional(),
})

const formSchema = z.object({
    warehouseId: z.coerce.number().int().positive('Chọn kho'),
    reason: z.string().optional(),
    notes: z.string().optional(),
    details: z.array(detailSchema).min(1, 'Cần ít nhất 1 mặt hàng'),
})

export default function CreateImportDialog() {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const { actionLoading } = useSelector((state) => state.stockTransaction)
    const warehouses = useSelector((state) => state.warehouse.warehouses || [])
    const products = useSelector((state) => state.product.products || [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            warehouseId: undefined,
            reason: '',
            notes: '',
            details: [{ productId: '', quantity: 1, unitPrice: 0, batchNumber: '', expiryDate: '', notes: '' }],
        },
    })

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'details' })

    const onSubmit = async (values) => {
        try {
            await dispatch(createImportTransaction(values)).unwrap()
            await dispatch(getStockTransactions({ transactionType: 'import', limit: 20, page: 1 }))
            setOpen(false)
            form.reset()
        } catch (_) { /* toast shown in slice */ }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) form.reset() }}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Tạo Phiếu Nhập
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo Phiếu Nhập Kho</DialogTitle>
                    <DialogDescription>Phiếu sẽ được tạo ở trạng thái Nháp.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="warehouseId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kho nhập *</FormLabel>
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : ''}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Chọn kho" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {warehouses.map((w) => (
                                                <SelectItem key={w.id} value={String(w.id)}>{w.warehouseName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="reason" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lý do nhập kho</FormLabel>
                                    <FormControl><Input placeholder="VD: Nhập hàng từ NCC..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl><Textarea placeholder="Ghi chú thêm..." className="resize-none h-16" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Items */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-sm">Danh sách mặt hàng</p>
                                <Button type="button" size="sm" variant="outline" className="h-7 gap-1"
                                    onClick={() => append({ productId: '', quantity: 1, unitPrice: 0, batchNumber: '', expiryDate: '', notes: '' })}>
                                    <PlusCircle className="h-3.5 w-3.5" /> Thêm mặt hàng
                                </Button>
                            </div>

                            {form.formState.errors.details?.root && (
                                <p className="text-sm text-destructive mb-2">{form.formState.errors.details.root.message}</p>
                            )}

                            <div className="space-y-3">
                                {fields.map((field, idx) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end rounded-lg border p-3 bg-muted/20">
                                        {/* Product */}
                                        <div className="col-span-4">
                                            <FormField control={form.control} name={`details.${idx}.productId`} render={({ field: f }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Sản phẩm *</FormLabel>
                                                    <Select onValueChange={(v) => f.onChange(Number(v))} value={f.value ? String(f.value) : ''}>
                                                        <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Chọn SP" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            {products.map((p) => (
                                                                <SelectItem key={p.id} value={String(p.id)}>
                                                                    {p.productName} [{p.sku}]
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        {/* Qty */}
                                        <div className="col-span-2">
                                            <FormField control={form.control} name={`details.${idx}.quantity`} render={({ field: f }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Số lượng *</FormLabel>
                                                    <FormControl><Input type="number" className="h-8 text-xs" {...f} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        {/* Price */}
                                        <div className="col-span-2">
                                            <FormField control={form.control} name={`details.${idx}.unitPrice`} render={({ field: f }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Đơn giá</FormLabel>
                                                    <FormControl><Input type="number" className="h-8 text-xs" {...f} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        {/* Batch */}
                                        <div className="col-span-2">
                                            <FormField control={form.control} name={`details.${idx}.batchNumber`} render={({ field: f }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Số lô</FormLabel>
                                                    <FormControl><Input className="h-8 text-xs" placeholder="LOT-001" {...f} /></FormControl>
                                                </FormItem>
                                            )} />
                                        </div>
                                        {/* Remove */}
                                        <div className="col-span-2 flex gap-1">
                                            <FormField control={form.control} name={`details.${idx}.expiryDate`} render={({ field: f }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="text-xs">HSD</FormLabel>
                                                    <FormControl><Input type="date" className="h-8 text-xs" {...f} /></FormControl>
                                                </FormItem>
                                            )} />
                                            {fields.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 self-end text-destructive hover:text-destructive"
                                                    onClick={() => remove(idx)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                            <Button type="submit" disabled={actionLoading}>
                                {actionLoading ? 'Đang lưu...' : 'Tạo Phiếu'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
