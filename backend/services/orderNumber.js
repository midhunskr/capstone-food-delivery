import crypto from 'node:crypto'

/**
 * Human-facing order numbers: MR-8K4P2Q.
 *
 * Alphabet excludes O/0 and I/1/L so a number read aloud or copied off a screen
 * doesn't come back wrong. 6 characters from 30 symbols is ~729 million
 * combinations — collisions are handled by the unique index and a retry, not by
 * a counter collection that would need coordinating.
 *
 * Carries no user data.
 */
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const LENGTH = 6

export const generateOrderNumber = () => {
    const bytes = crypto.randomBytes(LENGTH)
    let code = ''
    for (let i = 0; i < LENGTH; i++) code += ALPHABET[bytes[i] % ALPHABET.length]
    return `MR-${code}`
}

/**
 * Creates a document with a unique order number, retrying on the rare duplicate.
 */
export const createWithOrderNumber = async (Model, payload, attempts = 5) => {
    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            return await Model.create({ ...payload, orderNumber: generateOrderNumber() })
        } catch (error) {
            const duplicateOrderNumber = error?.code === 11000 && error?.keyPattern?.orderNumber
            if (!duplicateOrderNumber || attempt === attempts - 1) throw error
        }
    }
    throw new Error('Could not allocate an order number')
}
