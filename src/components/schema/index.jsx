import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, { message: 'Mật khẩu phải ít nhất 8 ký tự' })
  .regex(/[A-Z]/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa',
  })
  .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất một số' })
  .regex(/[\W_]/, { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt' })

const phoneRegex =
  /^(?:\+84|0)(?:3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, { message: 'Không được để trống' }),
  newPassword: passwordSchema,
  passwordConfirmation: z.string().min(1, { message: 'Không được để trống' }),
})

const updateProfileSchema = z.object({
  fullName: z.string().min(1, { message: 'Không được để trống' }),
  phone: z
    .string()
    .nullable()
    .refine((value) => !value || phoneRegex.test(value), {
      message: 'Số điện thoại không hợp lệ',
    }),
  bankCode: z.string().optional(),
  bankName: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
})

export { changePasswordSchema, updateProfileSchema }
