// import Stripe from 'stripe'

// //Create a payment
// export const createPayment = async (req, res) => {
//   try {

//     const stripe = new Stripe(process.env.Stripe_Private_Api_Key);

//     const {itemsQuantity} = req.body
//     console.log("=======quantity", itemsQuantity);
    

//     const lineItems = itemsQuantity.map((item)=> ({
//       price_data: {
//         currency: "inr",
//         item_data: {
//           name: item.name,
//           images: [item.image],
//         },
//         unit_amount: Math.round(item.price * 100)
//       },
//       quantity: item.quantity,
//     }))

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: `${CLIENT_DOMAIN}/user/payment/success`,
//       cancel_url: `${CLIENT_DOMAIN}/user/payment/cancel`,
//     })

//     res.json({ success: true, sessionId: session.id })

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error, payment unsuccessfull.",
//     });
//   }
// };


// import Stripe from 'stripe';

// // Create a payment
// export const createPayment = async (req, res) => {
//   try {
//     const stripe = new Stripe(process.env.Stripe_Private_Api_Key);

//     const { menuItems, totalPrice, deliveryFee, taxRate, grandTotal, customerName, customerAddress } = req.body; // Destructure orderData
//     console.log("=======orderData", grandTotal);

//     // Group menuItems by _id and sum quantities
//     const groupedMenuItems = menuItems.reduce((acc, item) => {
//       const existingItem = acc.find(i => i._id === item._id);
//       if (existingItem) {
//         existingItem.quantity += item.quantity;
//       } else {
//         acc.push({ ...item });
//       }
//       return acc;
//     }, []);

//     const lineItems = groupedMenuItems.map((item) => ({
//       price_data: {
//         currency: "INR",
//         product_data: { // Use product_data instead of item_data
//           name: item.name,
//           images: [item.image], // Access the images array directly
//         },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.quantity,
//     }));
    
//     // Add delivery fee and tax as separate line items if needed
//     if (totalPrice > 0) {
//       lineItems.push({
//         price_data: {
//           currency: "INR",
//           product_data: {
//             name: "Total Price",
//           },
//           unit_amount: Math.round(totalPrice * 100),
//         },
//         quantity: 1,
//       });
//     }
    

//     // Add delivery fee and tax as separate line items if needed
//     if (deliveryFee > 0) {
//       lineItems.push({
//         price_data: {
//           currency: "INR",
//           product_data: {
//             name: "Delivery Fee",
//           },
//           unit_amount: Math.round(deliveryFee * 100),
//         },
//         quantity: 1,
//       });
//     }

//     if (taxRate > 0) {
//       lineItems.push({
//         price_data: {
//           currency: "INR",
//           product_data: {
//             name: "GST & Restaurant Charges",
//           },
//           unit_amount: Math.round(taxRate * 100),
//         },
//         quantity: 1,
//       });
//     }

//     if (grandTotal > 0) {
//       lineItems.push({
//         price_data: {
//           currency: "INR",
//           product_data: {
//             name: "Amount to Pay",
//           },
//           unit_amount: Math.round(grandTotal * 100),
//         },
//         quantity: 1,
//       });
//     }
//     console.log("grandTotal==========", grandTotal);
    

//     console.log("lineItems===========", lineItems);
    

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: 'payment',
//       customer_details: { 
//         name: customerName,
//         address: customerAddress
//       },
//       success_url: `${process.env.CLIENT_DOMAIN}/user/checkout/success`,
//       cancel_url: `${process.env.CLIENT_DOMAIN}/user/checkout/cancel`,
//     });

//     console.log("route hit=====", session);

//     res.json({ success: true, sessionId: session.id });

//   } catch (error) {
//     console.error("Error creating Stripe Checkout session:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error, payment unsuccessful.",
//     });
//   }
// };

import Razorpay from 'razorpay'

export const createPayment = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("route hit 1");
    

    const options = {
      amount: req.body.grandTotal * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    console.log("requestBody=============",req.body);
    
    
    console.log("route hit 2");

    const order = await instance.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
