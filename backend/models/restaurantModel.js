import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true, unique: true },
    phone: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
)

export const Restaurant = mongoose.model('Restaurant', restaurantSchema)