import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalPrice: { type: Number, required: true },
    status: {
        type: String, enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String, required: true
    },
    },
    { timestamps: true }
)

export const Order = mongoose.model('Order', orderSchema)