import mongoose from 'mongoose'

/**
 * v2 Offer — discovery/display only in this block.
 * Eligibility and money calculation belong to checkout and are not implemented yet.
 *
 * scope 'global'     → applies across the app
 * scope 'restaurant' → tied to `restaurant`
 */
const offerSchema = new mongoose.Schema({
    code: { type: String, uppercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String },

    type: { type: String, enum: ['percentage', 'flat', 'free_delivery'], required: true },
    value: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    minimumOrder: { type: Number, default: 0 },

    scope: { type: String, enum: ['global', 'restaurant'], default: 'global' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'V2Restaurant', default: null },

    validFrom: { type: Date, default: null },
    validTo: { type: Date, default: null },

    isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: 'v2offers' })

offerSchema.index({ code: 1 }, { unique: true, sparse: true })
offerSchema.index({ isActive: 1, scope: 1 })
offerSchema.index({ restaurant: 1, isActive: 1 })

export const Offer = mongoose.model('V2Offer', offerSchema)
