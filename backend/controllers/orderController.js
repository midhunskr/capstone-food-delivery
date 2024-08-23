import { Menu } from "../models/menuItemModel.js";
import { Order } from "../models/orderModel.js";
import { Restaurant } from "../models/restaurantModel.js";
import { User } from "../models/userModel.js";

//Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      menuItems,
      restaurantId,
      deliveryFee,
      taxRate,
      deliveryAddress,
      status,
    } = req.body;

    //Price calculation
    let totalPrice = 0;

    for (const item of menuItems) {
      const menuItem = await Menu.findById(item.menuItem);
      totalPrice += menuItem.price * item.quantity;
    }

    //Adding delivery charge
    if (deliveryFee) {
      totalPrice += deliveryFee;
    }

    //Adding tax
    if (taxRate) {
      totalPrice += totalPrice * taxRate;
    }

    // Fetch user and restaurant details
    const userFind = await User.findById(req.user.id);
    const restaurantFind = await Restaurant.findById(restaurantId);

    //Create new order instance
    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      menuItems,
      deliveryFee,
      taxRate,
      totalPrice,
      deliveryAddress,
      status,
    });

    //Save the order in to DB
    const createdOrder = await order.save();

    //Success response
    res.status(201).json({
      success: true,
      message: `Order created successfully by '${userFind.name}' for '${restaurantFind.name}'`,
      order: createdOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, failed to create order.",
    });
  }
};

//Get all orders (User)
export const getAllOrdersUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error, order not found" });
  }
};

// Get all orders (Admin access only)
export const getAllOrdersAdmin = async (req, res) => {
  try {

    // Fetch all orders, populating user and restaurant details
    const orders = await Order.find().populate('user', 'name email').populate('restaurant', 'name location')

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, unable to fetch orders.',
    });
  }
};

//Get order by Id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('restaurant', 'name location');

    // Error handling for order not found
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Allow only the user who placed the order or an admin to view the order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, unable to fetch order.',
    });
  }
};

//Delete order by Id (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    const restaurant = await Restaurant.findById(order.restaurant);
    res.json({
      success: true,
      message: `Order has been deleted from '${restaurant.name}' successfully!`,
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error, order not found" });
  }
};
