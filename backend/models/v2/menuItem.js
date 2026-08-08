import mongoose from 'mongoose'

/**
 * v2 MenuItem — standalone, referencing Restaurant.
 * `category` is the menu section heading ("Biryani", "Starters").
 * Prices are whole rupees.
 */
const menuItemSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'V2Restaurant', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String },
    description: { type: String },
    image: { type: String },

    category: { type: String, required: true },
    // Position of this item's section on the menu. Menus read in a deliberate
    // order (signatures first, drinks last); alphabetical would put Desserts
    // above Kerala Specials.
    categoryOrder: { type: Number, default: 0 },
    cuisines: [{ type: String }],

    price: { type: Number, required: true },

    isVeg: { type: Boolean, required: true },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },

    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },

    orderCount: { type: Number, default: 0 },
}, { timestamps: true, collection: 'v2menuitems' })

menuItemSchema.index({ restaurant: 1, category: 1 })
menuItemSchema.index({ restaurant: 1, isAvailable: 1 })
menuItemSchema.index({ isAvailable: 1, isPopular: 1, 'rating.average': -1 })
menuItemSchema.index({ isVeg: 1, isAvailable: 1 })
menuItemSchema.index({ name: 'text', description: 'text' },
    { weights: { name: 10, description: 1 }, name: 'menuitem_search' })

export const MenuItem = mongoose.model('V2MenuItem', menuItemSchema)
