import mongoose from 'mongoose'

/**
 * Discovery cuisines/categories. Deliberately a thin lookup table — the
 * authoritative link is the `cuisines: [slug]` array on Restaurant/MenuItem.
 */
const cuisineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: 'v2cuisines' })

cuisineSchema.index({ isActive: 1, displayOrder: 1 })

export const Cuisine = mongoose.model('V2Cuisine', cuisineSchema)
