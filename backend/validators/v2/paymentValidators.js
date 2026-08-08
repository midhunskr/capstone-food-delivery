import { z } from 'zod'

const objectId = z.string().trim().regex(/^[a-f\d]{24}$/i, 'That item is no longer available.')

/**
 * Payment creation takes the same inputs as a quote. Deliberately no amount,
 * total or price field exists here — the server decides what is owed.
 */
export const createPaymentSchema = z.object({
    restaurantId: z.string().trim().regex(/^[a-f\d]{24}$/i, "That restaurant isn't available right now."),
    items: z.array(z.object({
        menuItemId: objectId,
        quantity: z.coerce.number().int().min(1, 'Check the quantities in your cart.').max(20),
    })).min(1, 'Your cart is empty.').max(30),
    offerCode: z.string().trim().max(30).nullish().transform((v) => (v ? v : undefined)),
    addressId: z.string().trim().regex(/^[a-f\d]{24}$/i, "We couldn't find that address.")
        .describe('Required: an order needs somewhere to go.'),
})

export const verifyPaymentSchema = z.object({
    razorpayOrderId: z.string().trim().min(1, 'Missing payment reference.'),
    razorpayPaymentId: z.string().trim().min(1, 'Missing payment reference.'),
    signature: z.string().trim().min(1, 'Missing payment reference.'),
})

export const paymentFailedSchema = z.object({
    razorpayOrderId: z.string().trim().min(1, 'Missing payment reference.'),
    reason: z.string().trim().max(120).nullish().transform((v) => (v ? v : undefined)),
})
