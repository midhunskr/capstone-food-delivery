import mongoose from 'mongoose'

/**
 * v2 Restaurant.
 *
 * Separate collection from the legacy `restaurants` so v1 keeps working while
 * this becomes the authoritative model. Menu items are standalone documents
 * (models/v2/menuItem.js), not embedded — the legacy embedding is what made
 * dish-level search, ratings and availability impossible.
 *
 * Money is stored in whole rupees (integers). The demo market is Kochi, INR.
 */
const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: { type: String },

    image: { type: String },
    coverImage: { type: String },

    cuisines: [{ type: String }],

    area: { type: String, required: true },
    city: { type: String, default: 'Kochi' },
    addressLine: { type: String },
    // [lng, lat]. Present for future distance/Mapbox work; not queried yet.
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: undefined },
    },

    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },

    priceForTwo: { type: Number, required: true },
    deliveryTimeMinutes: { type: Number, required: true },
    deliveryFee: { type: Number, default: 35 },
    freeDeliveryAbove: { type: Number, default: null },
    minimumOrder: { type: Number, default: 0 },

    isVegOnly: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    popularityScore: { type: Number, default: 0 },
}, { timestamps: true, collection: 'v2restaurants' })

restaurantSchema.index({ isActive: 1, popularityScore: -1 })
restaurantSchema.index({ isActive: 1, 'rating.average': -1 })
restaurantSchema.index({ cuisines: 1, isActive: 1 })
restaurantSchema.index({ isActive: 1, deliveryTimeMinutes: 1 })
restaurantSchema.index({ name: 'text', description: 'text', cuisines: 'text' },
    { weights: { name: 10, cuisines: 5, description: 1 }, name: 'restaurant_search' })

export const Restaurant = mongoose.model('V2Restaurant', restaurantSchema)
