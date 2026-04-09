import { z } from 'zod'

const createCategorySchema = z.object({
  categoryName: z.string().min(1, { message: 'Không được để trống' }),
  categoryCode: z
    .string()
    .min(1, { message: 'Không được để trống' })
    .regex(/^[A-Z0-9-]+$/, { message: 'Mã danh mục chỉ chứa chữ in hoa, số và dấu gạch ngang' }),
  status: z.string().min(1, { message: 'Không được để trống' }),
  parentId: z.string().optional().nullable(),
})

const updateCategorySchema = z.object({
  categoryName: z.string().min(1, { message: 'Không được để trống' }),
  categoryCode: z
    .string()
    .min(1, { message: 'Không được để trống' })
    .regex(/^[A-Z0-9-]+$/, { message: 'Mã danh mục chỉ chứa chữ in hoa, số và dấu gạch ngang' }),
  status: z.string().min(1, { message: 'Không được để trống' }),
  parentId: z.string().optional().nullable(),
})

const updateCategoryStatusSchema = z.object({
  status: z.string().min(1, { message: 'Không được để trống' }),
})

export { createCategorySchema, updateCategorySchema, updateCategoryStatusSchema }
