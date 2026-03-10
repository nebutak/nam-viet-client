import { z } from 'zod'

const createWarrantyQuoteSchema = z.object({
  note: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'rejected']).default('pending'),
})

export { createWarrantyQuoteSchema }
