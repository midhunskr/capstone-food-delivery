import { z } from 'zod'

/**
 * Query schemas for discovery. Everything arrives as a string, so coerce and
 * clamp here — controllers get clean typed values.
 */

const csv = z.string().transform((v) => v.split(',').map((s) => s.trim()).filter(Boolean))

const bool = z.enum(['1', 'true', '0', 'false']).transform((v) => v === '1' || v === 'true')

export const listRestaurantsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    q: z.string().trim().max(80).optional(),
    cuisine: csv.optional(),
    veg: bool.optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    maxDeliveryTime: z.coerce.number().int().min(1).max(180).optional(),
    maxPrice: z.coerce.number().int().min(1).optional(),
    offers: bool.optional(),
    freeDelivery: bool.optional(),
    sort: z.enum(['relevance', 'popular', 'rating', 'deliveryTime', 'priceLow', 'priceHigh']).default('relevance'),
})

export const slugParamSchema = z.object({
    slug: z.string().trim().min(1).max(120),
})

export const menuQuerySchema = z.object({
    veg: bool.optional(),
    q: z.string().trim().max(80).optional(),
    category: z.string().trim().max(60).optional(),
})

export const searchSchema = z.object({
    q: z.string().trim().max(80).default(''),
    limit: z.coerce.number().int().min(1).max(20).default(8),
})

export const offersQuerySchema = z.object({
    restaurantSlug: z.string().trim().max(120).optional(),
})
