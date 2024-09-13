// // redux/features/cartSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   items: [], // Array to hold selected items
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     addItemToCart: (state, action) => {
//       const { item, quantity } = action.payload;
//       const existingItemIndex = state.items.findIndex(cartItem => cartItem._id === item._id);

//       if (existingItemIndex !== -1) {
//         // Update quantity of the existing item
//         state.items[existingItemIndex].quantity += quantity;
//       } else {
//         // Add the new item to the array
//         state.items.push({ ...item, quantity });
//       }
//     },
//     removeItemFromCart: (state, action) => {
//       const itemId = action.payload;
//       state.items = state.items.filter(cartItem => cartItem._id !== itemId);
//     },
//     increment: (state, action) => {
//       const itemId = action.payload;
//       const item = state.items.find(item => item._id === itemId);
//       if (item) {
//         item.quantity += 1;
//       }
//     },
//     decrement: (state, action) => {
//       const itemId = action.payload;
//       const item = state.items.find(item => item._id === itemId);
//       if (item) {
//         if (item.quantity > 1) {
//           item.quantity -= 1;
//         } else {
//           state.items = state.items.filter(item => item._id !== itemId);
//         }
//       }
//     },
//     clearCart: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const { addItemToCart, removeItemFromCart, updateItemQuantity, increment, decrement, clearCart } = cartSlice.actions;

// export default cartSlice.reducer;


import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  cartItems: [],
  cartTotalQuanity: 0,
  cartTotalAmount: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart (state, action) {
      state.cartItems.push({...action.payload, quantity: 1})
    },

    // addToCart: (state, action) => {
    //   const existingItem = state.cartItems.find(
    //     (cartItem) => cartItem._id === action.payload._id
    //   );
    //   if (existingItem) {
    //     // If the item already exists, increase its quantity
    //     existingItem.quantity += 1;
    //   } else {
    //     // Add the item to the cart and initialize quantity to 1
    //     state.cartItems.push({ ...action.payload, quantity: 1 });
    //   }
    // },

    removeItemFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(cartItem => cartItem._id !== itemId);
    },
    increment: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find((item) => item._id === itemId);
      if (item) {
        item.quantity += 1;
      }
    },
    decrement: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find((item) => item._id === itemId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter((item) => item._id !== itemId);
        }
      }
      
    },
  },
})

export const {addToCart, removeItemFromCart, increment, decrement } = cartSlice.actions

export default cartSlice.reducer