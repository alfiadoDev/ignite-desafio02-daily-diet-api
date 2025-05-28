import { z } from 'zod'

export const foodBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  isItOnDiet: z.boolean(),
})

export const foodParamsSchema = z.object({
  foodId: z.string().uuid(),
})
