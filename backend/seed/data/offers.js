/**
 * Demo offers. `restaurantSlug` links restaurant-scoped offers; null means global.
 * Titles are written to be readable on a card with no extra explanation.
 */
export const offers = [
    {
        code: 'FIRSTORDER', title: '50% off up to ₹100',
        description: 'On your first order. Minimum ₹199.',
        type: 'percentage', value: 50, maxDiscount: 100, minimumOrder: 199,
        scope: 'global', restaurantSlug: null, isActive: true,
    },
    {
        code: 'SAVE75', title: 'Flat ₹75 off above ₹349',
        description: 'Applies to any restaurant.',
        type: 'flat', value: 75, maxDiscount: null, minimumOrder: 349,
        scope: 'global', restaurantSlug: null, isActive: true,
    },
    {
        code: null, title: 'Free delivery above ₹249',
        description: 'No delivery fee on orders over ₹249.',
        type: 'free_delivery', value: 0, maxDiscount: null, minimumOrder: 249,
        scope: 'restaurant', restaurantSlug: 'dum-street', isActive: true,
    },
    {
        code: null, title: '20% off up to ₹120',
        description: 'On all biryani and grills.',
        type: 'percentage', value: 20, maxDiscount: 120, minimumOrder: 299,
        scope: 'restaurant', restaurantSlug: 'al-barakah-grills', isActive: true,
    },
    {
        code: null, title: '15% off your order',
        description: 'Every day, minimum ₹199.',
        type: 'percentage', value: 15, maxDiscount: 150, minimumOrder: 199,
        scope: 'restaurant', restaurantSlug: 'kappa-and-co', isActive: true,
    },
    {
        code: null, title: 'Flat ₹50 off above ₹249',
        description: 'On breakfast and tiffin orders.',
        type: 'flat', value: 50, maxDiscount: null, minimumOrder: 249,
        scope: 'restaurant', restaurantSlug: 'amminis', isActive: true,
    },
    {
        code: null, title: 'Free delivery above ₹299',
        description: 'On burgers and shakes.',
        type: 'free_delivery', value: 0, maxDiscount: null, minimumOrder: 299,
        scope: 'restaurant', restaurantSlug: 'bun-stop', isActive: true,
    },
    {
        code: 'EXPIRED10', title: '10% off up to ₹50',
        description: 'This promotion has ended.',
        type: 'percentage', value: 10, maxDiscount: 50, minimumOrder: 149,
        scope: 'global', restaurantSlug: null, isActive: false,
        // Kept deliberately: gives the frontend an inactive offer to filter out.
        expired: true,
    },
]
