/**
 * Frontend-facing shapes.
 *
 * The rule that matters: a restaurant card looks identical on home, in listings
 * and in search results; a dish card looks identical on a menu, in "popular
 * dishes" and in search. The frontend normalizes nothing.
 *
 * Mongoose documents are never returned directly.
 */

export const restaurantCard = (r, { offer = null } = {}) => ({
    id: r._id.toString(),
    name: r.name,
    slug: r.slug,
    shortDescription: r.shortDescription ?? null,
    image: r.image ?? null,
    cuisines: r.cuisines ?? [],
    area: r.area,
    city: r.city,
    rating: {
        average: r.rating?.average ?? 0,
        count: r.rating?.count ?? 0,
    },
    priceForTwo: r.priceForTwo,
    deliveryTimeMinutes: r.deliveryTimeMinutes,
    deliveryFee: r.deliveryFee,
    freeDeliveryAbove: r.freeDeliveryAbove ?? null,
    isVegOnly: !!r.isVegOnly,
    isFeatured: !!r.isFeatured,
    isPopular: !!r.isPopular,
    // Short line the card can print directly, e.g. "20% off up to ₹100". null when none.
    offerLabel: offer ? offer.title : null,
})

export const restaurantDetail = (r, { offers = [] } = {}) => ({
    ...restaurantCard(r, { offer: offers[0] ?? null }),
    description: r.description ?? null,
    coverImage: r.coverImage ?? null,
    addressLine: r.addressLine ?? null,
    minimumOrder: r.minimumOrder ?? 0,
    isActive: r.isActive !== false,
    offers: offers.map(offerCard),
})

export const menuItemCard = (item, { restaurant = null } = {}) => ({
    id: item._id.toString(),
    name: item.name,
    slug: item.slug ?? null,
    description: item.description ?? null,
    image: item.image ?? null,
    category: item.category,
    price: item.price,
    isVeg: !!item.isVeg,
    isAvailable: item.isAvailable !== false,
    isPopular: !!item.isPopular,
    isBestseller: !!item.isBestseller,
    rating: {
        average: item.rating?.average ?? 0,
        count: item.rating?.count ?? 0,
    },
    // Present when the dish is shown outside its own restaurant's menu
    // (popular dishes, search) so the card can link back.
    restaurant: restaurant
        ? {
            id: restaurant._id.toString(),
            name: restaurant.name,
            slug: restaurant.slug,
            area: restaurant.area,
            deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
            rating: {
                average: restaurant.rating?.average ?? 0,
                count: restaurant.rating?.count ?? 0,
            },
        }
        : null,
})

export const offerCard = (o) => ({
    id: o._id.toString(),
    code: o.code ?? null,
    title: o.title,
    description: o.description ?? null,
    type: o.type,
    value: o.value ?? 0,
    maxDiscount: o.maxDiscount ?? null,
    minimumOrder: o.minimumOrder ?? 0,
    scope: o.scope,
    restaurant: o.restaurant
        ? (o.restaurant._id
            ? { id: o.restaurant._id.toString(), name: o.restaurant.name, slug: o.restaurant.slug }
            : { id: o.restaurant.toString() })
        : null,
    validTo: o.validTo ?? null,
})

/** Enough to recognise an order in a list. */
export const orderCard = (o) => ({
    orderNumber: o.orderNumber,
    status: o.status,
    restaurant: {
        name: o.restaurant.name,
        slug: o.restaurant.slug,
        area: o.restaurant.area ?? null,
        image: o.restaurant.image ?? null,
    },
    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
    itemsSummary: o.items.map((i) => i.name).join(', '),
    total: o.pricing.total,
    paymentStatus: o.payment?.status ?? 'pending',
    placedAt: o.createdAt,
    deliveredAt: o.deliveredAt ?? null,
})

export const orderDetail = (o) => ({
    ...orderCard(o),
    items: o.items.map((i) => ({
        menuItemId: i.menuItemId.toString(),
        name: i.name,
        image: i.image ?? null,
        isVeg: i.isVeg ?? null,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
    })),
    restaurant: {
        id: o.restaurant.id.toString(),
        name: o.restaurant.name,
        slug: o.restaurant.slug,
        area: o.restaurant.area ?? null,
        image: o.restaurant.image ?? null,
        deliveryTimeMinutes: o.restaurant.deliveryTimeMinutes ?? null,
    },
    deliveryAddress: o.deliveryAddress ?? null,
    pricing: {
        subtotal: o.pricing.subtotal,
        discount: o.pricing.discount ?? 0,
        deliveryFee: o.pricing.deliveryFee ?? 0,
        tax: o.pricing.tax ?? 0,
        taxPercent: o.pricing.taxPercent ?? null,
        total: o.pricing.total,
    },
    offer: o.offer?.title ? { code: o.offer.code ?? null, title: o.offer.title, savings: o.offer.savings ?? 0 } : null,
    // Payment method only. No provider ids, no signature material.
    payment: {
        status: o.payment?.status ?? 'pending',
        method: o.payment?.method ?? null,
        paidAt: o.payment?.paidAt ?? null,
    },
    estimatedMinutes: o.estimatedMinutes?.min
        ? { min: o.estimatedMinutes.min, max: o.estimatedMinutes.max }
        : null,
    statusHistory: (o.statusHistory ?? []).map((s) => ({ status: s.status, at: s.at })),
    confirmedAt: o.confirmedAt ?? null,
})

export const addressDto = (a) => ({
    id: a._id.toString(),
    label: a.label,
    customLabel: a.customLabel ?? null,
    recipientName: a.recipientName ?? null,
    phone: a.phone ?? null,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 ?? null,
    area: a.area ?? null,
    city: a.city,
    state: a.state ?? null,
    postalCode: a.postalCode,
    landmark: a.landmark ?? null,
    latitude: a.latitude ?? null,
    longitude: a.longitude ?? null,
    isDefault: !!a.isDefault,
})

export const cuisineCard = (c, { restaurantCount } = {}) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    image: c.image ?? null,
    ...(restaurantCount === undefined ? {} : { restaurantCount }),
})
