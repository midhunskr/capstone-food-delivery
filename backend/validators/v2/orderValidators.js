import { z } from 'zod'

export const listOrdersSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
})

export const orderNumberSchema = z.object({
    orderNumber: z.string().trim().regex(/^MR-[A-Z2-9]{6}$/i, "We couldn't find that order."),
})

export const favouriteSchema = z.object({
    restaurantId: z.string().trim().regex(/^[a-f\d]{24}$/i, "We couldn't find that restaurant."),
})
