import { z } from 'zod'

/**
 * Request schemas for v2 auth.
 *
 * Messages here are shown directly to the user, so they read like a person
 * wrote them. Validation is server-side and authoritative — the client's own
 * checks are a convenience, never a guarantee.
 */

const name = z
    .string({ error: 'Please tell us your name.' })
    .trim()
    .min(2, 'That name looks a little short.')
    .max(60, 'That name is too long.')

const email = z
    .email('That email address doesn\'t look right.')
    .trim()
    .toLowerCase()
    .max(254, 'That email address is too long.')

const password = z
    .string({ error: 'Please choose a password.' })
    .min(8, 'Use at least 8 characters.')
    .max(128, 'That password is too long.')

/**
 * Phone is optional and validated conservatively. This is an India-focused demo,
 * so we accept an optional +country prefix and 7–15 digits (the E.164 range)
 * rather than pretending to be a full international phone library.
 */
const phone = z
    .string()
    .nullish()
    .transform((value) => (value ?? '').replace(/[\s\-()]/g, ''))
    .refine(
        (value) => value === '' || /^\+?[1-9]\d{6,14}$/.test(value),
        'That phone number doesn\'t look right.'
    )
    .transform((value) => (value === '' ? undefined : value))

export const registerSchema = z.object({
    name,
    email,
    password,
    phone,
})

export const loginSchema = z.object({
    email,
    // Login only checks that something was sent. Applying the registration rules
    // here would tell an attacker which passwords are even possible, and would
    // lock out anyone whose existing password predates the current policy.
    password: z.string({ error: 'Please enter your password.' }).min(1, 'Please enter your password.'),
})
