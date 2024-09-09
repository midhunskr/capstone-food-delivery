import mongoose from "mongoose"

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    available: { type: Boolean, default: true },
    veg: { type: Boolean, default: true },        // New field for veg
    recommended: { type: Boolean, default: true }, // New field for recommended
    category: { type: String },                     // New field for category
    image: { type: String }
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    menuItems: [menuItemSchema]
    },
    { timestamps: true }
)

export const Restaurant = mongoose.model('Restaurant', restaurantSchema)