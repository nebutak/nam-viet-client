import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusIcon } from '@radix-ui/react-icons'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { useDispatch, useSelector } from 'react-redux'
import { updateProductSchema } from '../schema'
import { getTaxes } from '@/stores/TaxSlice'
import { getMaterials } from '@/stores/MaterialSlice'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUnits } from '@/stores/UnitSlice'
import { getCategories } from '@/stores/CategorySlice'
import MoneyInput from '@/components/custom/MoneyInput'
import { getAttributes } from '@/stores/AttributeSlice'
import { TrashIcon } from 'lucide-react'
import {
  matchAttributes,
  TAX_STATUS,
} from '../data'
import { getSuppliers } from '@/stores/SupplierSlice'
import { cn } from '@/lib/utils'
import { updateProduct, getProductDetail } from '@/stores/ProductSlice'
import CreateSupplierDialog from '../../supplier/components/CreateSupplierDialog'
import CreateCategoryDialog from '../../category/components/CreateCategoryDialog'
import CreateUnitDialog from '../../unit/components/CreateUnitDialog'
import MaterialSelectionDialog from './MaterialSelectionDialog'
import { getPublicUrl } from '@/utils/file'
import { normalizeFloatString } from '@/utils/normalize-text'
import { Loader2 } from 'lucide-react'
import { useMediaQuery } from '@/hooks/UseMediaQuery'

const UpdateProductDialog = ({
  product,
  open,

  onOpenChange,
  showTrigger = true,
  contentClassName,
  overlayClassName,
  ...props
}) => {
  const loading = useSelector((state) => state.product.loading)
  const dispatch = useDispatch()
  const taxes = useSelector((state) => state.tax.taxes)
  const materials = useSelector((state) => state.material.materials)
  const units = useSelector((state) => state.unit.units)
  const attributes = useSelector((state) => state.attribute.attributes)
  const categories = useSelector((state) => state.category.categories)
  const suppliers = useSelector((state) => state.supplier.suppliers)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [selectedFile, setSelectedFile] = useState(null)
  const [showCreateSupplierDialog, setShowCreateSupplierDialog] =
    useState(false)
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] =
    useState(false)
  const [showCreateUnitDialog, setShowCreateUnitDialog] = useState(false)
  const [showMaterialDialog, setShowMaterialDialog] = useState(false)

  // NEW: State to hold full product details
  const [fullProduct, setFullProduct] = useState(product)
  const [isFetchingDetail, setIsFetchingDetail] = useState(false)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null)
  }

  // Fetch full details when opened
  useEffect(() => {
    if (open && product?.id) {
      setIsFetchingDetail(true)
      dispatch(getProductDetail(product.id))
        .unwrap()
        .then((data) => {
          setFullProduct(data)
        })
        .catch((error) => {
          console.error('Failed to fetch product details', error)
        })
        .finally(() => {
          setIsFetchingDetail(false)
        })
    } else {
      setFullProduct(product)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id, dispatch])

  useEffect(() => {
    dispatch(getTaxes())
    dispatch(getMaterials())
    dispatch(getUnits())
    dispatch(getCategories())
    dispatch(getAttributes())
    dispatch(getSuppliers())
  }, [dispatch])

  const defaultAttributeWithValue = {
    attributeId: '',
    value: '',
  }

  const form = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      taxIds: [],
      attributeIdsWithValue: [],
      categoryId: '',
      supplierId: '',
      unitId: '',
      basePrice: '',
      price: '',
      name: '',
      description: '',
      note: '',
      type: product?.type || 'PRODUCT',
      minStockLevel: '0',
      source: '',

      image: null,
      hasExpiry: false,
      code: '',
      applyWarranty: false,
      warrantyPolicy: {
        periodMonths: '',
        conditions: '',
        warrantyCost: '0',
        status: 'active',
      },
      unitConversions: [{ unitId: '', conversionFactor: '' }],
    },
  })

  const selectedBaseUnitId = form.watch('unitId')
  const selectedSupplierId = form.watch('supplierId')

  // =========================
  // Field arrays
  // =========================
  const {
    fields: attrFields,
    append: appendAttr,
    remove: removeAttr,
  } = useFieldArray({
    control: form.control,
    name: 'attributeIdsWithValue',
  })

  const {
    fields: conversionFields,
    append: appendConversion,
    remove: removeConversion,
    replace: replaceConversions,
  } = useFieldArray({
    control: form.control,
    name: 'unitConversions',
  })

  // Remove conversion rows that equal base unit
  useEffect(() => {
    if (!selectedBaseUnitId) return
    const baseId = String(selectedBaseUnitId)
    const current = form.getValues('unitConversions') || []
    const cleaned = current.filter((c) => String(c?.unitId || '') !== baseId)
    if (cleaned.length === 0) cleaned.push({ unitId: '', conversionFactor: '' })
    replaceConversions(cleaned)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBaseUnitId])

  // Reset when open/product changes
  useEffect(() => {
    if (!fullProduct || !open) return

    form.reset({
      code: fullProduct.code ?? '',
      name: fullProduct.productName ?? fullProduct.name ?? '',
      basePrice: fullProduct.basePrice ?? '',
      price: fullProduct.price?.toString?.() ?? '',
      description: fullProduct.description ?? '',
      note: fullProduct.note ?? '',
      minStockLevel: fullProduct.minStockLevel?.toString?.() ?? '0',
      source: fullProduct.source ?? '',
      categoryId: fullProduct.categoryId?.toString?.() ?? '',
      unitId:
        fullProduct.unitId?.toString?.() ||
        fullProduct.baseUnitId?.toString?.() ||
        fullProduct?.prices?.[0]?.unitId?.toString?.() ||
        '',
      supplierId:
        (fullProduct.supplierId?.toString?.() ||
          fullProduct.prices?.[0]?.supplierId?.toString?.()) ??
        '',
      taxIds:
        fullProduct.taxIds ??
        fullProduct.prices?.[0]?.taxes?.map((tax) => tax.id) ??
        [],
      materialIds:
        fullProduct.materials?.map((m) => m.materialId) ??
        [],
      attributeIdsWithValue:
        (fullProduct.productHasAttributes ?? fullProduct.attributes)?.map((attr) => ({
          attributeId: (attr.attributeId ?? attr.id)?.toString?.() ?? '',
          value: attr.value ?? attr.pivot?.value ?? '',
        })) ?? [],

      image: null,
      hasExpiry: fullProduct.hasExpiry ?? false,
      manageSerial: fullProduct.manageSerial ?? false,
      applyWarranty: fullProduct.applyWarranty ?? !!fullProduct.warrantyPolicy,
      warrantyPolicy: fullProduct.warrantyPolicy
        ? {
          periodMonths:
            fullProduct.warrantyPolicy.periodMonths?.toString?.() ?? '',
          conditions: fullProduct.warrantyPolicy.conditions ?? '',
          warrantyCost:
            fullProduct.warrantyPolicy.warrantyCost?.toString?.() ?? '0',
          status: fullProduct.warrantyPolicy.status ?? 'active',
        }
        : {
          periodMonths: '',
          conditions: '',
          warrantyCost: '0',
          status: 'active',
        },
      unitConversions: fullProduct?.unitConversions?.length
        ? fullProduct.unitConversions.map((c) => ({
          unitId: c.unitId?.toString?.() || '',
          conversionFactor: normalizeFloatString(c?.conversionFactor),
        }))
        : [{ unitId: '', conversionFactor: '' }],
    })

    setSelectedFile(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullProduct, open])

  const onSubmit = async (data) => {
    try {
      const filteredAttributes = (data.attributeIdsWithValue || []).filter(
        (attribute) => attribute.attributeId !== '' && attribute.value !== '',
      )

      // NEW: normalize conversions
      const filteredUnitConversions = (data.unitConversions || [])
        .filter((c) => c?.unitId !== '' && c?.conversionFactor !== '')
        .map((c) => ({
          unitId: c.unitId,
          conversionFactor: Number(
            String(c.conversionFactor).replace(/,/g, ''),
          ),
        }))
        .filter(
          (c) =>
            String(c.unitId) !== String(data.unitId) &&
            Number.isFinite(c.conversionFactor) &&
            c.conversionFactor > 0,
        )

      // de-dup by unitId (keep last)
      const map = new Map()
      for (const c of filteredUnitConversions) map.set(String(c.unitId), c)
      const dedupUnitConversions = Array.from(map.values())

      const fullData = {
        code: data.code,
        taxIds: data.taxIds,
        materialIds: data.materialIds,
        attributeIdsWithValue: filteredAttributes,
        categoryId: data.categoryId,
        supplierId: data.supplierId,
        unitId: data.unitId,
        basePrice: data.basePrice,
        price: data.price || 0,
        name: data.name,
        description: data.description,
        note: data.note,
        type: data.type,
        minStockLevel: data.minStockLevel,

        image: selectedFile,
        hasExpiry: data.hasExpiry,
        manageSerial: data.manageSerial,
        applyWarranty: data.applyWarranty,
        warrantyPolicy: data.applyWarranty
          ? {
            periodMonths: data.warrantyPolicy.periodMonths,
            conditions: data.warrantyPolicy.conditions || null,
            warrantyCost: data.warrantyPolicy.warrantyCost || 0,
            status: data.warrantyPolicy.status || 'inactive',
          }
          : null,

        unitConversions: dedupUnitConversions,
      }

      // Send full data like CREATE (PUT semantics - replace entire resource)
      // No longer filtering by dirty fields

      await dispatch(
        updateProduct({ id: product.id, data: fullData }),
      ).unwrap()
      form.reset()
      onOpenChange?.(false)
    } catch (error) {
      console.log('Submit error: ', error)
    }
  }

  const getFileExtension = (path) => {
    if (!path) return ''
    const parts = path.split('.')
    return parts[parts.length - 1].toLowerCase()
  }

  const isImageFile = (path) => {
    const ext = getFileExtension(path)
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)
  }

  const getFileNameFromPath = (path) => {
    if (!path) return ''
    const parts = path.split(/[\\/]/)
    return parts[parts.length - 1]
  }

  const baseUnitName =
    units?.find((u) => String(u.id) === String(selectedBaseUnitId))?.unitName || ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="mx-2" variant="outline" size="sm">
            <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            Cập nhật
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className={cn(
          "md:h-auto md:max-w-7xl",
          isMobile && "fixed inset-0 w-screen h-[100dvh] top-0 left-0 right-0 max-w-none m-0 p-0 rounded-none translate-x-0 translate-y-0 flex flex-col",
          contentClassName
        )}
        overlayClassName={overlayClassName}
      >
        <DialogHeader className={cn(isMobile && "px-4 pt-4")}>
          <DialogTitle>Cập nhật sản phẩm: {fullProduct?.name}</DialogTitle>
          <DialogDescription>
            Điền vào chi tiết phía dưới để cập nhật sản phẩm
          </DialogDescription>
        </DialogHeader>

        {isFetchingDetail ? (
          <div className="flex justify-center items-center py-10 w-full min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className={cn(
            "overflow-auto",
            isMobile ? "h-full px-4 pb-4 flex-1" : "max-h-[65vh] md:max-h-[75vh]"
          )}>
            <Form {...form}>
              <form id="update-product" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-3 grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="mb-2 space-y-1">
                        <FormLabel required={false}>
                          Mã sản phẩm{' '}
                          <span className="text-xs italic text-blue-600">
                            (Tự sinh nếu bỏ trống)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập mã sản phẩm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-2 space-y-1">
                        <FormLabel required={true}>Tên sản phẩm</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên sản phẩm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <MoneyInput
                    form={form}
                    label="Giá gốc (VNĐ)"
                    name="basePrice"
                    required={false}
                    placeholder="Nhập giá vốn (không bắt buộc)"
                  />

                  <MoneyInput
                    form={form}
                    label="Giá bán (VNĐ)"
                    name="price"
                    required={false}
                    placeholder="Nhập giá sản phẩm (không bắt buộc)"
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="mb-2 space-y-1">
                        <FormLabel required={true}>Danh mục</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-7 ps-3 text-xs"
                          onClick={() => setShowCreateCategoryDialog(true)}
                        >
                          <PlusIcon className="mr-1 h-3 w-3" />
                          Thêm mới
                        </Button>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại sản phẩm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[100031]">
                            <SelectGroup>
                              {categories
                                ?.filter(
                                  (category) =>
                                    category.status === 'active',
                                )
                                .map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    {category.categoryName}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <FormItem className="mb-2 space-y-1">
                        <FormLabel required={true}>Đơn vị tính (gốc)</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-7 ps-3 text-xs"
                          onClick={() => setShowCreateUnitDialog(true)}
                        >
                          <PlusIcon className="mr-1 h-3 w-3" />
                          Thêm mới
                        </Button>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn đơn vị tính" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[100031]">
                            <SelectGroup>
                              {units?.map((unit) => (
                                <SelectItem
                                  key={unit.id}
                                  value={unit.id.toString()}
                                >
                                  {unit.unitName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem className="mb-2 space-y-1">
                        <FormLabel required={true}>Nhà cung cấp</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-7 ps-3 text-xs"
                          onClick={() => setShowCreateSupplierDialog(true)}
                        >
                          <PlusIcon className="mr-1 h-3 w-3" />
                          Thêm mới
                        </Button>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhà cung cấp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[100031]">
                            <SelectGroup>
                              {suppliers
                                ?.filter(
                                  (supplier) => supplier.status !== 'suspend',
                                )
                                .map((supplier) => (
                                  <SelectItem
                                    key={supplier.id}
                                    value={supplier.id.toString()}
                                  >
                                    {supplier.supplierName}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-2 space-y-1">
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            rows="1"
                            placeholder="Nhập mô tả"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="mb-2 space-y-1">
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Textarea
                            rows="1"
                            placeholder="Nhập ghi chú nếu có"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <MoneyInput
                    form={form}
                    label="Tồn kho tối thiểu"
                    name="minStockLevel"
                    required={true}
                    placeholder="Nhập mức tồn kho tối thiểu"
                  />



                  <FormField
                    control={form.control}
                    name="image"
                    render={() => {
                      // Support both old 'document' and new 'image' fields for backward compatibility
                      const oldImagePath = product?.image || product?.document || product?.coefficient?.image
                      const oldImageUrl = getPublicUrl(oldImagePath)
                      const isImage = isImageFile(oldImagePath)
                      const fileName = getFileNameFromPath(oldImagePath)

                      return (
                        <FormItem className="mb-2 space-y-1">
                          <FormLabel>Hình ảnh</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                onChange={handleFileChange}
                                className="max-w-xs"
                              />

                              {oldImagePath && oldImageUrl && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    Ảnh:
                                  </span>

                                  <a
                                    href={oldImageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs text-blue-600 underline"
                                  >
                                    {isImage ? (
                                      <>
                                        <img
                                          src={oldImageUrl}
                                          alt={fileName || 'Ảnh hiện tại'}
                                          className="h-10 w-10 rounded border object-cover"
                                        />
                                        <span>Xem ảnh</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="max-w-[180px] truncate">
                                          {fileName || 'Tập tin hiện tại'}
                                        </span>
                                        <span>Mở file</span>
                                      </>
                                    )}
                                  </a>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>

                {/* NEW: Unit conversions block */}
                <div className="mb-3 mt-2 rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Đơn vị quy đổi</p>
                      <p className="text-xs italic text-muted-foreground">
                        Quy ước:{' '}
                        <strong>1 {baseUnitName || '(đơn vị gốc)'}</strong> ={' '}
                        <strong>Hệ số quy đổi</strong> × <strong>đơn vị</strong>
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-8"
                      onClick={() =>
                        appendConversion({ ...defaultUnitConversion })
                      }
                      disabled={!selectedBaseUnitId}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Thêm đơn vị quy đổi
                    </Button>
                  </div>

                  {!selectedBaseUnitId ? (
                    <p className="text-sm italic text-muted-foreground">
                      Vui lòng chọn “Đơn vị tính (gốc)” trước khi thêm đơn vị quy
                      đổi.
                    </p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {conversionFields.map((row, index) => (
                        <div
                          key={row.id}
                          className="flex items-end gap-3 rounded-md border p-3"
                        >
                          <FormField
                            control={form.control}
                            name={`unitConversions.${index}.unitId`}
                            render={({ field }) => (
                              <FormItem className="w-1/2 space-y-1">
                                <FormLabel>Đơn vị</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn đơn vị" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="z-[100031]">
                                    <SelectGroup>
                                      {units
                                        ?.filter(
                                          (u) =>
                                            String(u.id) !==
                                            String(selectedBaseUnitId),
                                        )
                                        .map((unit) => (
                                          <SelectItem
                                            key={unit.id}
                                            value={unit.id.toString()}
                                          >
                                            {unit.unitName}
                                          </SelectItem>
                                        ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`unitConversions.${index}.conversionFactor`}
                            render={({ field }) => (
                              <FormItem className="w-1/2 space-y-1">
                                <FormLabel>Hệ số quy đổi</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="Ví dụ: 1000 hoặc 0.5"
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                      let v = e.target.value.replace(/,/g, '.')
                                      v = v.replace(/[^\d.]/g, '')
                                      const parts = v.split('.')
                                      if (parts.length > 2)
                                        v = `${parts[0]}.${parts.slice(1).join('')}`
                                      field.onChange(v)
                                    }}
                                    onBlur={(e) => {
                                      const raw = (e.target.value || '').replace(
                                        /,/g,
                                        '.',
                                      )
                                      if (raw === '') return
                                      const n = Number(raw)
                                      field.onChange(
                                        Number.isFinite(n) ? String(n) : '',
                                      )
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pb-1">
                            <TrashIcon
                              className="h-4 w-4 cursor-pointer text-destructive"
                              onClick={() => {
                                if (conversionFields.length <= 1) {
                                  form.setValue(`unitConversions.${index}`, {
                                    ...defaultUnitConversion,
                                  })
                                  return
                                }
                                removeConversion(index)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Attributes Block */}
                <div>
                  <div className="mb-3 mt-4 border-t pt-4 grid gap-4 md:grid-cols-2">
                    {attrFields.map((fieldItem, index) => (
                      <div key={fieldItem.id} className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name={`attributeIdsWithValue.${index}.attributeId`}
                          render={({ field }) => (
                            <FormItem className="mb-2 w-1/2 space-y-1">
                              <FormLabel>Thuộc tính</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn thuộc tính" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="z-[100031]">
                                  <SelectGroup>
                                    {attributes.map((attribute) => (
                                      <SelectItem
                                        key={attribute.id}
                                        value={attribute.id.toString()}
                                      >
                                        {`${attribute.name} (${matchAttributes[attribute?.unit]})`}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`attributeIdsWithValue.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="mb-2 h-16 w-1/2 space-y-1">
                              <FormLabel>Giá trị</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập giá trị" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="mt-4 inline-block cursor-pointer">
                          <TrashIcon
                            className="h-4 w-4 text-destructive"
                            onClick={() => removeAttr(index)}
                          />
                        </div>
                      </div>
                    ))}


                  </div>
                </div>
                <div className="mb-3 grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="taxIds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-3">
                          <FormLabel>Các loại thuế áp dụng</FormLabel>
                        </div>
                        {taxes
                          ?.filter((tax) => tax.status === TAX_STATUS.ACTIVE)
                          .map((tax) => (
                            <FormItem
                              key={tax.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tax.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), tax.id]
                                      : field.value?.filter(
                                        (value) => value !== tax.id,
                                      ) || []
                                    field.onChange(newValue)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {tax.title} -{' '}
                                <strong className="text-destructive">
                                  ({tax.percentage}%)
                                </strong>
                              </FormLabel>
                            </FormItem>
                          ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="materialIds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-3">
                          <FormLabel>Nguyên liệu sử dụng</FormLabel>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowMaterialDialog(true)}
                            className="w-fit"
                          >
                            Chọn nguyên liệu ({field.value?.length || 0})
                          </Button>

                          {field.value?.length > 0 && (
                            <div className="text-sm text-muted-foreground mt-2 border rounded-md p-3 max-h-32 overflow-y-auto">
                              <strong>Đã chọn: </strong>
                              {materials
                                ?.filter((m) => field.value.map(String).includes(String(m.id)))
                                ?.map((m) => m.productName)
                                .join(', ')}
                            </div>
                          )}
                        </div>

                        <MaterialSelectionDialog
                          open={showMaterialDialog}
                          onOpenChange={setShowMaterialDialog}
                          materials={materials}
                          initialSelectedIds={field.value}
                          onConfirm={(ids) => field.onChange(ids)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-3">
                          <FormLabel>Hạn dùng</FormLabel>
                        </div>

                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Quản lý hạn dùng
                          </FormLabel>
                        </FormItem>
                        <p className="text-sm italic text-muted-foreground mt-2">
                          Bật nếu sản phẩm cần theo dõi Số Lô (Batch) và Hạn sử dụng (Expiry Date) khi nhập / xuất kho.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applyWarranty"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-3">
                          <FormLabel>Bảo hành</FormLabel>
                        </div>
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked)
                                if (!checked) {
                                  form.setValue('warrantyPolicy', {
                                    periodMonths:
                                      product?.warrantyPolicy?.periodMonths,
                                    conditions:
                                      product?.warrantyPolicy?.conditions || null,
                                    warrantyCost:
                                      product?.warrantyPolicy?.warrantyCost || 0,
                                    status:
                                      product?.warrantyPolicy?.status || 'active',
                                  })
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Áp dụng bảo hành
                          </FormLabel>
                        </FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('applyWarranty') && (
                    <div className="mb-3 mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="warrantyPolicy.periodMonths"
                        render={({ field }) => (
                          <FormItem className="mb-2 space-y-1">
                            <FormLabel required>Số tháng bảo hành</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Ví dụ: 12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <MoneyInput
                        form={form}
                        label="Chi phí bảo hành (tùy chọn)"
                        name="warrantyPolicy.warrantyCost"
                        placeholder="0"
                      />

                      <FormField
                        control={form.control}
                        name="warrantyPolicy.conditions"
                        render={({ field }) => (
                          <FormItem className="mb-2 space-y-1 md:col-span-2">
                            <FormLabel>Điều kiện bảo hành</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={2}
                                placeholder="Mô tả điều kiện bảo hành (không bắt buộc)"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="warrantyPolicy.status"
                        render={({ field }) => (
                          <FormItem className="mb-2 space-y-1">
                            <FormLabel required>Trạng thái</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || 'active'}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="z-[100031]">
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Tạm dừng</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        )}
        <DialogFooter className={cn("flex gap-2 sm:space-x-0", isMobile && "pb-4 px-4")}>
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

          <Button form="update-product" loading={loading}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>      {
        showCreateSupplierDialog && (
          <CreateSupplierDialog
            open={showCreateSupplierDialog}
            onOpenChange={setShowCreateSupplierDialog}
            showTrigger={false}
            contentClassName="z-[100040]"
            overlayClassName="z-[100039]"
          />
        )
      }

      {
        showCreateCategoryDialog && (
          <CreateCategoryDialog
            open={showCreateCategoryDialog}
            onOpenChange={setShowCreateCategoryDialog}
            showTrigger={false}
            contentClassName="z-[100040]"
            overlayClassName="z-[100039]"
          />
        )
      }

      {
        showCreateUnitDialog && (
          <CreateUnitDialog
            open={showCreateUnitDialog}
            onOpenChange={setShowCreateUnitDialog}
            showTrigger={false}
            contentClassName="z-[100040]"
            overlayClassName="z-[100039]"
          />
        )
      }
    </Dialog >
  )
}

export default UpdateProductDialog
