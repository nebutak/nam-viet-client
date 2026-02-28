import { z } from 'zod'

const phoneRegex = /^\+?\d{1,}$/

const createCustomerSchema = z.object({
  code: z.string().nullable(),
  name: z.string().min(1, { message: 'Tên khách hàng không được để trống' }),
  phone: z
    .string()
    .min(1, { message: 'Số điện thoại không được để trống' })
    .refine((value) => !value || phoneRegex.test(value), {
      message: 'Số điện thoại không hợp lệ',
    }),
  email: z
    .string()
    .email({ message: 'Email không hợp lệ' })
    .or(z.literal(''))
    .optional(),
  address: z
    .string()
    .min(1, { message: 'Địa chỉ không được để trống' })
    .max(120, { message: 'Địa chỉ không được vượt quá 120 ký tự' }),
  represent: z
    .string()
    .max(120, { message: 'Tên đại diện không được vượt quá 120 ký tự' })
    .nullable(),
  note: z
    .string()
    .max(120, { message: 'Ghi chú không được vượt quá 120 ký tự' })
    .nullable(),
  type: z
    .enum(['company', 'partner', 'other'], {
      message: 'Loại khách hàng không hợp lệ',
    })
    .nullable(),
  taxCode: z
    .string()
    .max(120, { message: 'Mã số thuế không được vượt quá 120 ký tự' })
    .nullable(),
  identityCard: z
    .string()
    .max(20, { message: 'Số CMND/CCCD không được vượt quá 20 ký tự' })
    .nullable(),
  identityDate: z.string().nullable(),
  identityPlace: z
    .string()
    .max(255, { message: 'Nơi cấp không được vượt quá 255 ký tự' })
    .nullable(),
})

const updateCustomerSchema = z.object({
  code: z.string().nullable(),
  name: z.string().min(1, { message: 'Tên khách hàng không được để trống' }),
  phone: z
    .string()
    .min(1, { message: 'Số điện thoại không được để trống' })
    .refine((value) => !value || phoneRegex.test(value), {
      message: 'Số điện thoại không hợp lệ',
    }),
  email: z
    .string()
    .email({ message: 'Email không hợp lệ' })
    .or(z.literal(''))
    .optional(),
  address: z
    .string()
    .min(1, { message: 'Địa chỉ không được để trống' })
    .max(120, { message: 'Địa chỉ không được vượt quá 120 ký tự' }),
  represent: z
    .string()
    .max(120, { message: 'Tên đại diện không được vượt quá 120 ký tự' })
    .nullable(),
  note: z
    .string()
    .max(120, { message: 'Ghi chú không được vượt quá 120 ký tự' })
    .nullable(),
  type: z
    .enum(['company', 'partner', 'other'], {
      message: 'Loại khách hàng không hợp lệ',
    })
    .nullable(),
  taxCode: z
    .string()
    .max(120, { message: 'Mã số thuế không được vượt quá 120 ký tự' })
    .nullable(),
  identityCard: z
    .string()
    .max(20, { message: 'Số CMND/CCCD không được vượt quá 20 ký tự' })
    .nullable(),
  identityDate: z.string().nullable(),
  identityPlace: z
    .string()
    .max(255, { message: 'Nơi cấp không được vượt quá 255 ký tự' })
    .nullable(),
})

export { createCustomerSchema, updateCustomerSchema }
