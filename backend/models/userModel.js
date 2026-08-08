import mongoose from "mongoose"

/**
 * Delivery addresses, embedded on the user.
 *
 * They are never queried independently of their owner and a person has a
 * handful at most, so a separate collection would only add joins. Embedding
 * also makes ownership checks trivial — you can only ever reach your own.
 *
 * India/Kochi focused. Coordinates are optional and only present when the user
 * used location assistance.
 */
const addressSchema = new mongoose.Schema({
    label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    customLabel: { type: String, trim: true },
    recipientName: { type: String, trim: true },
    phone: { type: String, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    area: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true })

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, enum: ['user', 'delivery', 'admin'], default: 'user' },
    phone: { type: String },
    // v2 only. v1 never reads these, so adding them is non-invasive.
    addresses: { type: [addressSchema], default: [] },
    favouriteRestaurants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'V2Restaurant' }],
        default: [],
    },
}, { timestamps: true }
)

export const User = mongoose.model('User', userSchema)