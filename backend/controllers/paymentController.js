import { Order } from "../models/orderModel.js";
import { Payment } from "../models/paymentModel.js";
import { Restaurant } from "../models/restaurantModel.js";
import { User } from "../models/userModel.js";

//Create a payment
export const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, total, status } = req.body;

    //Find order Id
    const order = await Order.findById(orderId);

    //Error handling for order not found
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    //Fetch menu items, restaurant and user details
    const menu = await Order.findById(orderId).populate("menuItems.menuItem");
    const restaurant = await Restaurant.findById(menu.restaurant);
    const user = await User.findById(menu.user);

    //New payment instance
    const payment = new Payment({
      order: orderId,
      total: menu.totalPrice,
      paymentMethod,
      status,
    });

    // Save payment to DB
    const createdPayment = await payment.save();
    

    //Success response
    res.status(201).json({
      success: true,
      message: `Payment successfully done by '${user.name}' for '${restaurant.name}'`,
      payment: createdPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, payment unsuccessfull.",
    });
  }
};
