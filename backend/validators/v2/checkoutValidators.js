import { z } from 'zod'

const objectId = z.string().trim().regex(/^[a-f\d]{24}$/i, 'That item is no longer available.')

export const quoteSchema = z.object({
    restaurantId: z.string().trim().regex(/^[a-f\d]{24}$/i, "That restaurant isn't available right now."),
    items: z.array(z.object({
        menuItemId: objectId,
        quantity: z.coerce.number().int().min(1, 'Check the quantities in your cart.').max(20),
    })).min(1, 'Your cart is empty.').max(30),
    // Optional fields tolerate null as well as absent: a client sending
    // "no offer" as null shouldn't produce a validation error at checkout.
    offerCode: z.string().trim().max(30).nullish()
        .transform((v) => (v ? v : undefined)),
    addressId: z.string().trim().regex(/^[a-f\d]{24}$/i, "We couldn't find that address.").nullish()
        .transform((v) => (v ? v : undefined)),
})
