import { z } from 'zod'

const createRoleSchema = z.object({
  roleName: z.string().min(1, { message: 'Không được để trống' }),
  roleKey: z
    .string()
    .min(1, { message: 'Không được để trống' })
    .regex(/^[a-z_]+$/, {
      message: 'Mã vai trò chỉ được chứa chữ cái viết thường và dấu gạch dưới.',
    }),
})

const updateRoleSchema = z.object({
  roleName: z.string().min(1, { message: 'Không được để trống' }),
  roleKey: z
    .string()
    .min(1, { message: 'Không được để trống' })
    .regex(/^[a-z_]+$/, {
      message: 'Mã vai trò chỉ được chứa chữ cái viết thường và dấu gạch dưới.',
    }),
})

export { createRoleSchema, updateRoleSchema }
