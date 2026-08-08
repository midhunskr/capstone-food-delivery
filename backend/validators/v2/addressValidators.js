import { z } from 'zod'

/**
 * Address input. India/Kochi focused — deliberately not an international
 * address framework. Messages are shown to the user as written.
 */

/**
 * Optional text. A form that leaves a field blank may send "", null or nothing
 * at all — all three mean "not provided", and none of them should be a
 * validation error the user has to decipher.
 */
const optionalText = (max, message) =>
    z.string().trim().max(max, message).nullish()
        .transform((value) => (value ? value : undefined))

const phone = z
    .string()
    .nullish()
    .transform((value) => (value ?? '').replace(/[\s\-()]/g, ''))
    .refine((value) => value === '' || /^\+?[1-9]\d{6,14}$/.test(value),
        "That phone number doesn't look right.")
    .transform((value) => (value === '' ? undefined : value))

const base = {
    label: z.enum(['home', 'work', 'other'], { error: 'Pick a label for this address.' }).default('home'),
    customLabel: optionalText(30, 'That label is too long.'),
    recipientName: optionalText(60, 'That name is too long.'),
    phone,
    addressLine1: z.string({ error: 'Add the flat, house or building.' })
        .trim().min(3, 'Add a bit more detail.').max(120, 'That is too long.'),
    addressLine2: optionalText(120, 'That is too long.'),
    area: optionalText(80, 'That is too long.'),
    city: z.string({ error: 'Which city?' }).trim().min(2, 'Which city?').max(60, 'That is too long.'),
    state: optionalText(60, 'That is too long.'),
    postalCode: z.string({ error: 'Add a PIN code.' })
        .trim()
        .regex(/^\d{6}$/, 'A PIN code is 6 digits.'),
    landmark: optionalText(120, 'That is too long.'),
    latitude: z.coerce.number().min(-90).max(90).nullish()
        .transform((v) => (v ?? undefined)),
    longitude: z.coerce.number().min(-180).max(180).nullish()
        .transform((v) => (v ?? undefined)),
    isDefault: z.boolean().nullish().transform((v) => (v ?? undefined)),
}

export const createAddressSchema = z.object(base)

// Everything optional on edit, but at least one field must be present.
export const updateAddressSchema = z.object({
    ...base,
    label: base.label.optional(),
    addressLine1: base.addressLine1.optional(),
    city: base.city.optional(),
    postalCode: base.postalCode.optional(),
}).refine((data) => Object.keys(data).length > 0, 'Nothing to update.')

export const addressIdSchema = z.object({
    id: z.string().trim().regex(/^[a-f\d]{24}$/i, 'That address could not be found.'),
})
