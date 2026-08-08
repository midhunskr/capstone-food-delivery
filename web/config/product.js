/**
 * Product identity. Change it here and it changes everywhere — nothing else
 * hardcodes a name.
 */
export const product = {
    name: 'MORO',
    shortName: 'MORO',
    description: 'Order food from restaurants near you.',
    city: 'Kochi',
}

/** Currency formatting lives here so ₹ never gets hardcoded in a component. */
export const currency = {
    symbol: '₹',
    format: (amount) => `₹${Number(amount ?? 0).toLocaleString('en-IN')}`,
}
