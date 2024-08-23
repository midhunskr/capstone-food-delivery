import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    menuItems: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalPrice: { type: Number},
    deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String, enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {type: String},
    deliveryFee: { type: Number },
    taxRate: { type: Number }
    },
    { timestamps: true }
)

export const Order = mongoose.model('Order', orderSchema)